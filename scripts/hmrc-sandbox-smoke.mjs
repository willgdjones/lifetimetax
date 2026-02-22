/* eslint-disable no-console */
const baseUrl = process.env.HMRC_BASE_URL || 'https://test-api.service.hmrc.gov.uk';

async function main() {
  const health = await fetch(`${baseUrl}/hello/world`, {
    headers: { Accept: 'application/vnd.hmrc.1.0+json' },
  });

  if (!health.ok) {
    throw new Error(`Sandbox smoke test failed: ${health.status}`);
  }

  const payload = await health.json();
  console.log('HMRC sandbox reachable:', payload);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
