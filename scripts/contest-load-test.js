/**
 * CodeArena 10-User Concurrent Contest Load Test Simulator
 *
 * Simulates realistic contestant workflow:
 *  1. Contestant registers / enters contest
 *  2. Fetches problem descriptions
 *  3. Executes test runs (evaluating code in sandbox)
 *  4. Submits solution to contest
 *  5. Inspects live contest leaderboard
 *
 * Usage:
 *   node scripts/contest-load-test.js [--duration 30s] [--users 10] [--url http://localhost:3000]
 */

const http = require('http');
const https = require('https');

// Parse CLI options
const args = process.argv.slice(2);
function getArg(name, defaultValue) {
  const idx = args.indexOf(`--${name}`);
  if (idx !== -1 && args[idx + 1]) return args[idx + 1];
  return defaultValue;
}

const BASE_URL = getArg('url', process.env.BASE_URL || 'http://localhost:3000');
const NUM_USERS = parseInt(getArg('users', '10'), 10);
const RAW_DURATION = getArg('duration', '60s'); // e.g. "90m", "5m", "60s"

let DURATION_MS = 60000;
if (RAW_DURATION.endsWith('m')) {
  DURATION_MS = parseFloat(RAW_DURATION) * 60 * 1000;
} else if (RAW_DURATION.endsWith('s')) {
  DURATION_MS = parseFloat(RAW_DURATION) * 1000;
} else if (RAW_DURATION.endsWith('h')) {
  DURATION_MS = parseFloat(RAW_DURATION) * 60 * 60 * 1000;
}

const CONTEST_ID = getArg('contest', 'weekly-contest-42');

const METRICS = {
  totalRequests: 0,
  successfulRequests: 0,
  failedRequests: 0,
  statusCodes: {},
  latencies: [],
  endpointMetrics: {},
};

function recordMetric(endpoint, status, latency) {
  METRICS.totalRequests++;
  METRICS.latencies.push(latency);
  if (status >= 200 && status < 400) {
    METRICS.successfulRequests++;
  } else {
    METRICS.failedRequests++;
  }
  METRICS.statusCodes[status] = (METRICS.statusCodes[status] || 0) + 1;

  if (!METRICS.endpointMetrics[endpoint]) {
    METRICS.endpointMetrics[endpoint] = { calls: 0, totalMs: 0, errors: 0 };
  }
  METRICS.endpointMetrics[endpoint].calls++;
  METRICS.endpointMetrics[endpoint].totalMs += latency;
  if (status >= 400) METRICS.endpointMetrics[endpoint].errors++;
}

function sendRequest(method, urlPath, body, headers = {}) {
  return new Promise((resolve) => {
    const fullUrl = new URL(urlPath, BASE_URL);
    const isHttps = fullUrl.protocol === 'https:';
    const client = isHttps ? https : http;

    const postData = body ? JSON.stringify(body) : null;
    const reqHeaders = {
      'User-Agent': 'CodeArena-LoadTest-Agent/1.0',
      'Accept': 'application/json',
      ...headers,
    };
    if (postData) {
      reqHeaders['Content-Type'] = 'application/json';
      reqHeaders['Content-Length'] = Buffer.byteLength(postData);
    }

    const start = Date.now();
    const req = client.request(
      fullUrl,
      {
        method,
        headers: reqHeaders,
        timeout: 10000,
      },
      (res) => {
        let rawData = '';
        res.on('data', (chunk) => {
          rawData += chunk;
        });
        res.on('end', () => {
          const latency = Date.now() - start;
          recordMetric(`${method} ${urlPath.split('?')[0]}`, res.statusCode, latency);
          resolve({ status: res.statusCode, data: rawData, latency });
        });
      }
    );

    req.on('error', (err) => {
      const latency = Date.now() - start;
      recordMetric(`${method} ${urlPath.split('?')[0]}`, 599, latency);
      resolve({ status: 599, error: err.message, latency });
    });

    req.on('timeout', () => {
      req.destroy();
      const latency = Date.now() - start;
      recordMetric(`${method} ${urlPath.split('?')[0]}`, 504, latency);
      resolve({ status: 504, error: 'Request Timeout', latency });
    });

    if (postData) req.write(postData);
    req.end();
  });
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// User action simulation
async function simulateUser(userId, endTime) {
  const email = `contestant_${userId}@codearena.local`;
  console.log(`[User ${userId}] Started simulation as ${email}`);

  // 1. Initial Contest Entry / Registration
  await sendRequest('GET', `/api/contests/${CONTEST_ID}?userEmail=${encodeURIComponent(email)}`);
  await sleep(1000 + Math.random() * 1500);

  const sampleSolutions = [
    `function twoSum(nums, target) {
      const map = new Map();
      for (let i = 0; i < nums.length; i++) {
        const comp = target - nums[i];
        if (map.has(comp)) return [map.get(comp), i];
        map.set(nums[i], i);
      }
      return [];
    }`,
    `function maxSubArray(nums) {
      let maxSoFar = nums[0];
      let curr = nums[0];
      for (let i = 1; i < nums.length; i++) {
        curr = Math.max(nums[i], curr + nums[i]);
        maxSoFar = Math.max(maxSoFar, curr);
      }
      return maxSoFar;
    }`,
  ];

  let iteration = 0;
  while (Date.now() < endTime) {
    iteration++;

    // Step A: View contest dashboard / problems list
    await sendRequest('GET', `/api/contests/${CONTEST_ID}`);
    await sleep(2000 + Math.random() * 3000);

    // Step B: Run sample test code (Execute sandbox)
    const code = sampleSolutions[iteration % sampleSolutions.length];
    await sendRequest('POST', '/api/execute', {
      slug: 'two-sum',
      language: 'javascript',
      code,
      isSubmission: false,
    });
    await sleep(3000 + Math.random() * 4000);

    // Step C: Check live leaderboard
    await sendRequest('GET', '/api/leaderboard');
    await sleep(2000 + Math.random() * 2000);

    // Step D: Submit code to contest
    await sendRequest('POST', `/api/contests/${CONTEST_ID}/submissions`, {
      problemId: 'two-sum',
      code,
      language: 'javascript',
      userEmail: email,
      userName: `Contestant ${userId}`,
    });
    await sleep(5000 + Math.random() * 5000);
  }

  console.log(`[User ${userId}] Simulation cycle completed (${iteration} rounds).`);
}

function calculatePercentile(latencies, percentile) {
  if (latencies.length === 0) return 0;
  const sorted = [...latencies].sort((a, b) => a - b);
  const index = Math.ceil((percentile / 100) * sorted.length) - 1;
  return sorted[Math.max(0, index)];
}

async function runLoadTest() {
  console.log('====================================================');
  console.log('🚀 CodeArena Safe Contest Load Test Suite');
  console.log(`Target URL:      ${BASE_URL}`);
  console.log(`Active Users:    ${NUM_USERS} concurrent simulated contestants`);
  console.log(`Duration:        ${RAW_DURATION} (${DURATION_MS / 1000} seconds)`);
  console.log(`Contest ID:      ${CONTEST_ID}`);
  console.log('====================================================\n');

  const startTime = Date.now();
  const endTime = startTime + DURATION_MS;

  const userPromises = [];
  for (let i = 1; i <= NUM_USERS; i++) {
    // Stagger user arrivals slightly (realistic contest start)
    userPromises.push(
      (async (uid) => {
        await sleep((uid - 1) * 400);
        await simulateUser(uid, endTime);
      })(i)
    );
  }

  await Promise.all(userPromises);

  const totalDurationSec = ((Date.now() - startTime) / 1000).toFixed(2);
  const rps = (METRICS.totalRequests / totalDurationSec).toFixed(2);

  console.log('\n====================================================');
  console.log('📊 CONTEST LOAD TEST RESULTS & BENCHMARKS');
  console.log('====================================================');
  console.log(`Total Runtime:           ${totalDurationSec} seconds`);
  console.log(`Total Requests:          ${METRICS.totalRequests}`);
  console.log(`Successful (2xx/3xx):    ${METRICS.successfulRequests}`);
  console.log(`Failed / Errors (4xx/5xx): ${METRICS.failedRequests}`);
  console.log(`Overall Success Rate:    ${METRICS.totalRequests ? ((METRICS.successfulRequests / METRICS.totalRequests) * 100).toFixed(2) : 0}%`);
  console.log(`Throughput:              ${rps} req/sec`);
  console.log('----------------------------------------------------');
  console.log('⏱ Latency Distribution:');
  console.log(`  Min:                   ${METRICS.latencies.length ? Math.min(...METRICS.latencies) : 0}ms`);
  console.log(`  Median (p50):          ${calculatePercentile(METRICS.latencies, 50)}ms`);
  console.log(`  95th Percentile (p95): ${calculatePercentile(METRICS.latencies, 95)}ms`);
  console.log(`  99th Percentile (p99): ${calculatePercentile(METRICS.latencies, 99)}ms`);
  console.log(`  Max:                   ${METRICS.latencies.length ? Math.max(...METRICS.latencies) : 0}ms`);
  console.log('----------------------------------------------------');
  console.log('📌 Endpoint Breakdown:');
  for (const [endpoint, data] of Object.entries(METRICS.endpointMetrics)) {
    const avg = (data.totalMs / data.calls).toFixed(1);
    console.log(`  ${endpoint.padEnd(35)} Calls: ${String(data.calls).padEnd(5)} Avg: ${avg}ms  Errors: ${data.errors}`);
  }
  console.log('====================================================\n');
}

runLoadTest().catch((err) => {
  console.error('Fatal load test error:', err);
  process.exit(1);
});
