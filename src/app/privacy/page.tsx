export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <div className="rounded-xl border border-slate-200 bg-white/95 p-8 md:p-12">
        <h1 className="text-3xl font-black text-slate-900">Privacy Policy</h1>
        <p className="mt-2 text-sm text-slate-500">Last updated: 22 February 2026</p>
        <p className="mt-4 text-sm text-slate-700">
          This privacy policy explains how LifetimeTax (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;), operated by Perihelion Limited, collects, uses, stores, and protects your personal data when you use our website at lifetimetax.co.uk (the &quot;Service&quot;).
        </p>

        <section className="mt-8 space-y-6 text-sm leading-relaxed text-slate-700">
          {/* 1. Data Controller */}
          <div>
            <h2 className="text-lg font-bold text-slate-900">1. Data Controller</h2>
            <p className="mt-2">
              The data controller responsible for your personal data is:
            </p>
            <ul className="mt-2 list-none space-y-1 pl-0">
              <li><strong>Company:</strong> Perihelion Limited</li>
              <li><strong>Address:</strong> 35 Coppice Avenue, Great Shelford, Cambridge, CB22 5AQ, United Kingdom</li>
              <li><strong>Contact:</strong> Will Jones — <a href="mailto:will@perihelion.limited" className="text-brand-700 underline">will@perihelion.limited</a></li>
            </ul>
          </div>

          {/* 2. What Data We Collect */}
          <div>
            <h2 className="text-lg font-bold text-slate-900">2. What Data We Collect</h2>
            <p className="mt-2">We collect the following categories of personal data:</p>
            
            <h3 className="mt-3 font-semibold text-slate-800">2.1 Account Data</h3>
            <ul className="mt-1 list-disc space-y-1 pl-6">
              <li>Email address (used to create your account)</li>
              <li>Password (hashed and salted, never stored in plaintext)</li>
            </ul>

            <h3 className="mt-3 font-semibold text-slate-800">2.2 HMRC Tax Data</h3>
            <p className="mt-1">When you connect your HMRC account via Government Gateway, we retrieve:</p>
            <ul className="mt-1 list-disc space-y-1 pl-6">
              <li>Income tax paid per tax year</li>
              <li>National Insurance contributions (Class 1, 2, and 4)</li>
              <li>Employment history and employer details</li>
              <li>Self-assessment returns and tax calculations</li>
              <li>Student loan repayment amounts (where available)</li>
              <li>Total earnings per tax year</li>
            </ul>
            <p className="mt-2">
              <strong>Important:</strong> We never see, store, or have access to your Government Gateway username or password. Authentication is handled entirely by HMRC through their secure OAuth 2.0 flow. You log in directly on HMRC&apos;s website and grant us permission to read specific data only.
            </p>

            <h3 className="mt-3 font-semibold text-slate-800">2.3 Payment Data</h3>
            <ul className="mt-1 list-disc space-y-1 pl-6">
              <li>Stripe payment reference (we do not store your card number, expiry, or CVV)</li>
              <li>Whether you have purchased premium access</li>
            </ul>

            <h3 className="mt-3 font-semibold text-slate-800">2.4 Fraud Prevention Data (Required by HMRC)</h3>
            <p className="mt-1">HMRC legally requires us to collect and transmit the following with each API call:</p>
            <ul className="mt-1 list-disc space-y-1 pl-6">
              <li>Your IP address and port</li>
              <li>Browser user agent string</li>
              <li>Device identifier (a randomly generated UUID stored in a cookie)</li>
              <li>Screen resolution and window size</li>
              <li>Timezone</li>
            </ul>
            <p className="mt-2">This data is sent directly to HMRC as part of their fraud prevention requirements and is not used by us for any other purpose.</p>

            <h3 className="mt-3 font-semibold text-slate-800">2.5 Analytics Data</h3>
            <ul className="mt-1 list-disc space-y-1 pl-6">
              <li>Page views, click events, and feature usage (via PostHog)</li>
              <li>This data is anonymised and only collected with your consent</li>
            </ul>
          </div>

          {/* 3. How We Use Your Data */}
          <div>
            <h2 className="text-lg font-bold text-slate-900">3. How We Use Your Data</h2>
            <table className="mt-2 w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="py-2 pr-4 text-left font-semibold">Purpose</th>
                  <th className="py-2 text-left font-semibold">Lawful Basis (GDPR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-2 pr-4">Calculate your lifetime tax total and generate your tax receipt</td>
                  <td className="py-2">Contract performance (Art. 6(1)(b))</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4">Store your tax data so you don&apos;t need to reconnect HMRC each visit</td>
                  <td className="py-2">Contract performance (Art. 6(1)(b))</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4">Process premium payments via Stripe</td>
                  <td className="py-2">Contract performance (Art. 6(1)(b))</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4">Generate shareable cards (containing only aggregated totals, no personal identifiers)</td>
                  <td className="py-2">Contract performance (Art. 6(1)(b))</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4">Submit fraud prevention headers to HMRC</td>
                  <td className="py-2">Legal obligation (Art. 6(1)(c))</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4">Analyse usage to improve the Service</td>
                  <td className="py-2">Consent (Art. 6(1)(a))</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* 4. Data Storage & Security */}
          <div>
            <h2 className="text-lg font-bold text-slate-900">4. Data Storage &amp; Security</h2>
            
            <h3 className="mt-3 font-semibold text-slate-800">4.1 Encryption</h3>
            <p className="mt-1">We take the security of your data seriously:</p>
            <ul className="mt-1 list-disc space-y-1 pl-6">
              <li><strong>HMRC access and refresh tokens:</strong> Encrypted at rest using AES-256-GCM</li>
              <li><strong>National Insurance Number (NINO):</strong> Encrypted at rest using AES-256-GCM</li>
              <li><strong>Raw HMRC API responses:</strong> Encrypted at rest using AES-256-GCM</li>
              <li><strong>Calculated totals:</strong> Stored as plaintext (these are aggregated figures, not personally identifiable)</li>
              <li><strong>All data in transit:</strong> Protected by TLS 1.2 or higher</li>
            </ul>
            <p className="mt-2">Encryption keys are stored separately from the database and are never committed to source code.</p>

            <h3 className="mt-3 font-semibold text-slate-800">4.2 Infrastructure</h3>
            <ul className="mt-1 list-disc space-y-1 pl-6">
              <li><strong>Hosting:</strong> Railway (application hosting)</li>
              <li><strong>Database:</strong> Supabase (PostgreSQL with Row Level Security)</li>
              <li><strong>Payments:</strong> Stripe (PCI DSS Level 1 compliant)</li>
              <li><strong>DNS &amp; Domain:</strong> Cloudflare</li>
            </ul>

            <h3 className="mt-3 font-semibold text-slate-800">4.3 Access Controls</h3>
            <ul className="mt-1 list-disc space-y-1 pl-6">
              <li>Row Level Security (RLS) ensures users can only access their own data</li>
              <li>API routes always derive user identity from authenticated sessions, never from client-supplied parameters</li>
              <li>Service keys and secrets are stored in environment variables, never in source code</li>
            </ul>
          </div>

          {/* 5. Data Sharing */}
          <div>
            <h2 className="text-lg font-bold text-slate-900">5. Data Sharing</h2>
            <p className="mt-2">We share your personal data with the following third parties, only as necessary to provide the Service:</p>
            <table className="mt-2 w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="py-2 pr-4 text-left font-semibold">Provider</th>
                  <th className="py-2 pr-4 text-left font-semibold">Purpose</th>
                  <th className="py-2 text-left font-semibold">Data Shared</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-2 pr-4">HMRC</td>
                  <td className="py-2 pr-4">Retrieve your tax data &amp; submit fraud prevention headers</td>
                  <td className="py-2">OAuth tokens, fraud prevention metadata</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4">Supabase</td>
                  <td className="py-2 pr-4">Database hosting</td>
                  <td className="py-2">All stored data (encrypted where noted)</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4">Stripe</td>
                  <td className="py-2 pr-4">Payment processing</td>
                  <td className="py-2">Email, payment amount</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4">PostHog</td>
                  <td className="py-2 pr-4">Analytics (with consent only)</td>
                  <td className="py-2">Anonymised usage events</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4">Railway</td>
                  <td className="py-2 pr-4">Application hosting</td>
                  <td className="py-2">Server logs (IP addresses, request metadata)</td>
                </tr>
              </tbody>
            </table>
            <p className="mt-3">We do not sell your personal data to any third party. We do not share your data for marketing purposes.</p>
          </div>

          {/* 6. Share Cards */}
          <div>
            <h2 className="text-lg font-bold text-slate-900">6. Share Cards &amp; Public Data</h2>
            <p className="mt-2">
              When you generate a shareable &quot;tax receipt&quot; card, only aggregated totals are included (e.g., &quot;Total lifetime tax: £287,000&quot;). Share cards contain <strong>no personally identifiable information</strong> — no name, NINO, employer details, or individual tax year data.
            </p>
            <p className="mt-2">
              Share card URLs are publicly accessible. Once shared, the aggregated data on the card cannot be traced back to your identity without access to our database.
            </p>
          </div>

          {/* 7. Data Retention */}
          <div>
            <h2 className="text-lg font-bold text-slate-900">7. Data Retention</h2>
            <table className="mt-2 w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="py-2 pr-4 text-left font-semibold">Data Type</th>
                  <th className="py-2 text-left font-semibold">Retention Period</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-2 pr-4">Account data</td>
                  <td className="py-2">Until you delete your account</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4">HMRC tax data</td>
                  <td className="py-2">Until you delete your account or request deletion</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4">HMRC access tokens</td>
                  <td className="py-2">4 hours (expires automatically)</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4">HMRC refresh tokens</td>
                  <td className="py-2">18 months maximum (HMRC-imposed expiry)</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4">Payment records</td>
                  <td className="py-2">6 years (UK tax and accounting requirements)</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4">Analytics data</td>
                  <td className="py-2">12 months</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* 8. Cookies */}
          <div>
            <h2 className="text-lg font-bold text-slate-900">8. Cookies</h2>
            <table className="mt-2 w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="py-2 pr-4 text-left font-semibold">Cookie</th>
                  <th className="py-2 pr-4 text-left font-semibold">Purpose</th>
                  <th className="py-2 text-left font-semibold">Type</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-2 pr-4">Session cookie</td>
                  <td className="py-2 pr-4">Maintain your logged-in session</td>
                  <td className="py-2">Strictly necessary</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4">Device ID</td>
                  <td className="py-2 pr-4">HMRC fraud prevention (legally required)</td>
                  <td className="py-2">Strictly necessary</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4">Analytics cookies</td>
                  <td className="py-2 pr-4">PostHog usage tracking</td>
                  <td className="py-2">Consent required</td>
                </tr>
              </tbody>
            </table>
            <p className="mt-2">You can manage cookie preferences at any time through the cookie consent banner. Strictly necessary cookies cannot be disabled as they are required for the Service to function.</p>
          </div>

          {/* 9. Your Rights */}
          <div>
            <h2 className="text-lg font-bold text-slate-900">9. Your Rights Under UK GDPR</h2>
            <p className="mt-2">You have the following rights regarding your personal data:</p>
            <ul className="mt-2 list-disc space-y-2 pl-6">
              <li><strong>Right of access (Art. 15):</strong> Request a copy of all personal data we hold about you. Use the data export feature in your account settings, or contact us by email.</li>
              <li><strong>Right to rectification (Art. 16):</strong> Request correction of inaccurate personal data. Since tax data comes directly from HMRC, corrections to tax figures should be made with HMRC directly.</li>
              <li><strong>Right to erasure (Art. 17):</strong> Request deletion of your account and all associated data. Use the account deletion feature in your settings, or contact us by email. Deletion is permanent and cascading — all tax data, tokens, calculations, and share cards will be removed.</li>
              <li><strong>Right to data portability (Art. 20):</strong> Receive your data in a structured, commonly used, machine-readable format (JSON). Available via the data export feature.</li>
              <li><strong>Right to restriction of processing (Art. 18):</strong> Request that we limit how we process your data in certain circumstances.</li>
              <li><strong>Right to object (Art. 21):</strong> Object to processing based on legitimate interests (e.g., analytics).</li>
              <li><strong>Right to withdraw consent:</strong> Where processing is based on consent (e.g., analytics cookies), you may withdraw consent at any time.</li>
            </ul>
            <p className="mt-3">
              To exercise any of these rights, contact us at <a href="mailto:will@perihelion.limited" className="text-brand-700 underline">will@perihelion.limited</a>. We will respond within 30 days as required by UK GDPR.
            </p>
          </div>

          {/* 10. Data Export & Deletion */}
          <div>
            <h2 className="text-lg font-bold text-slate-900">10. Data Export &amp; Account Deletion</h2>
            <p className="mt-2">We provide self-service tools for data management:</p>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li><strong>Data export:</strong> Download all your data as a JSON file from your account settings</li>
              <li><strong>Account deletion:</strong> Permanently delete your account and all associated data from your account settings</li>
            </ul>
            <p className="mt-2">
              Account deletion is immediate and irreversible. All data including HMRC tokens, tax records, calculations, and share cards are permanently removed from our systems. HMRC OAuth access is revoked.
            </p>
          </div>

          {/* 11. Children */}
          <div>
            <h2 className="text-lg font-bold text-slate-900">11. Children&apos;s Privacy</h2>
            <p className="mt-2">
              The Service is not intended for individuals under 16 years of age. We do not knowingly collect personal data from children. If you believe we have inadvertently collected data from a child, please contact us and we will delete it immediately.
            </p>
          </div>

          {/* 12. International Transfers */}
          <div>
            <h2 className="text-lg font-bold text-slate-900">12. International Data Transfers</h2>
            <p className="mt-2">
              Your data may be processed by our third-party providers in jurisdictions outside the UK. Where this occurs, we ensure appropriate safeguards are in place:
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li>Supabase: Data stored in EU region (AWS eu-west-1)</li>
              <li>Stripe: Certified under UK-US Data Bridge and EU-US Data Privacy Framework</li>
              <li>PostHog: EU hosting available; Standard Contractual Clauses in place</li>
              <li>Railway: US-based hosting with Standard Contractual Clauses</li>
            </ul>
          </div>

          {/* 13. Security Breach */}
          <div>
            <h2 className="text-lg font-bold text-slate-900">13. Security Breach Notification</h2>
            <p className="mt-2">
              In the event of a personal data breach that poses a risk to your rights and freedoms, we will:
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li>Notify the Information Commissioner&apos;s Office (ICO) within 72 hours of becoming aware of the breach</li>
              <li>Notify HMRC at SDSTeam@hmrc.gov.uk within 72 hours</li>
              <li>Notify affected users without undue delay where the breach is likely to result in a high risk to rights and freedoms</li>
              <li>Document the breach, its effects, and remedial actions taken</li>
            </ul>
          </div>

          {/* 14. Changes */}
          <div>
            <h2 className="text-lg font-bold text-slate-900">14. Changes to This Policy</h2>
            <p className="mt-2">
              We may update this privacy policy from time to time. We will notify you of any material changes by posting the updated policy on this page and updating the &quot;Last updated&quot; date. For significant changes affecting how we process your data, we will notify you by email.
            </p>
          </div>

          {/* 15. Complaints */}
          <div>
            <h2 className="text-lg font-bold text-slate-900">15. Complaints</h2>
            <p className="mt-2">
              If you are unhappy with how we handle your personal data, you have the right to lodge a complaint with the Information Commissioner&apos;s Office (ICO):
            </p>
            <ul className="mt-2 list-none space-y-1 pl-0">
              <li><strong>Website:</strong> <a href="https://ico.org.uk" className="text-brand-700 underline" target="_blank" rel="noopener noreferrer">ico.org.uk</a></li>
              <li><strong>Helpline:</strong> 0303 123 1113</li>
              <li><strong>Address:</strong> Information Commissioner&apos;s Office, Wycliffe House, Water Lane, Wilmslow, Cheshire, SK9 5AF</li>
            </ul>
            <p className="mt-3">
              We encourage you to contact us first at <a href="mailto:will@perihelion.limited" className="text-brand-700 underline">will@perihelion.limited</a> so we can try to resolve your concern directly.
            </p>
          </div>
        </section>

        <div className="mt-10 border-t border-slate-200 pt-6 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Perihelion Limited. Company registered in England and Wales.</p>
        </div>
      </div>
    </main>
  );
}
