export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <div className="rounded-xl border border-slate-200 bg-white/95 p-8 md:p-12">
        <h1 className="text-3xl font-black text-slate-900">Terms and Conditions</h1>
        <p className="mt-2 text-sm text-slate-500">Last updated: 22 February 2026</p>
        <p className="mt-4 text-sm text-slate-700">
          These Terms and Conditions (&quot;Terms&quot;) govern your use of the LifetimeTax website and service at lifetimetax.co.uk (the &quot;Service&quot;), operated by Perihelion Limited (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;). By accessing or using the Service, you agree to be bound by these Terms.
        </p>

        <section className="mt-8 space-y-6 text-sm leading-relaxed text-slate-700">
          {/* 1 */}
          <div>
            <h2 className="text-lg font-bold text-slate-900">1. About the Service</h2>
            <p className="mt-2">
              LifetimeTax is a web application that connects to HM Revenue &amp; Customs (HMRC) via their official APIs to retrieve your tax history. We calculate your estimated lifetime tax total across all tax types and generate shareable &quot;tax receipt&quot; cards showing how your contributions have been allocated to public services.
            </p>
            <p className="mt-2">
              LifetimeTax is not affiliated with, endorsed by, or accredited by HMRC or the UK Government. We are an HMRC-recognised third-party application that uses HMRC&apos;s official developer APIs.
            </p>
          </div>

          {/* 2 */}
          <div>
            <h2 className="text-lg font-bold text-slate-900">2. Eligibility</h2>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li>You must be at least 16 years old to use the Service.</li>
              <li>You must be a UK taxpayer with a valid Government Gateway account to use the HMRC integration features.</li>
              <li>By using the Service, you confirm that any information you provide is accurate and complete.</li>
            </ul>
          </div>

          {/* 3 */}
          <div>
            <h2 className="text-lg font-bold text-slate-900">3. Account Registration</h2>
            <p className="mt-2">
              To use the Service, you must create an account using your email address. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must notify us immediately of any unauthorised use of your account.
            </p>
          </div>

          {/* 4 */}
          <div>
            <h2 className="text-lg font-bold text-slate-900">4. HMRC Connection</h2>
            <p className="mt-2">
              When you connect your HMRC account, you will be redirected to HMRC&apos;s Government Gateway login page. You authenticate directly with HMRC — we never see, store, or have access to your Government Gateway username or password.
            </p>
            <p className="mt-2">
              By connecting your HMRC account, you grant us permission to access your tax data through HMRC&apos;s APIs for the sole purpose of calculating your lifetime tax total and generating your tax receipt. You can revoke this access at any time by deleting your account.
            </p>
          </div>

          {/* 5 */}
          <div>
            <h2 className="text-lg font-bold text-slate-900">5. The Service</h2>
            <p className="mt-2">LifetimeTax is a free service. All users receive access to:</p>
            <ul className="mt-1 list-disc space-y-1 pl-6">
              <li>Your total lifetime tax figure</li>
              <li>A year-by-year breakdown</li>
              <li>Full breakdown by tax type (Income Tax, NI, VAT, Council Tax, etc.)</li>
              <li>&quot;Your Tax Paid For&quot; spending allocation</li>
              <li>Shareable tax receipt cards</li>
            </ul>
            <p className="mt-2">There is no charge to use the Service. We do not collect any payment information.</p>
          </div>

          {/* 7 */}
          <div>
            <h2 className="text-lg font-bold text-slate-900">6. Accuracy of Data and Calculations</h2>
            <p className="mt-2">
              <strong>Tax data from HMRC:</strong> Income tax, National Insurance, and other figures retrieved directly from HMRC APIs are presented as received. We do not modify this data. The accuracy of this data is the responsibility of HMRC and your own tax filings.
            </p>
            <p className="mt-2">
              <strong>Estimated figures:</strong> Some components of your lifetime tax total (VAT, Council Tax, Fuel Duty) are estimated based on publicly available data from the Office for National Statistics (ONS) and HM Treasury. These are statistical estimates based on your income level and national averages — they are not precise calculations of your actual tax paid in these categories.
            </p>
            <p className="mt-2">
              <strong>Spending allocation:</strong> The &quot;Your Tax Paid For&quot; breakdown uses published government spending proportions from HM Treasury&apos;s Country and Regional Analysis. These are averages and do not reflect how your specific tax payments were allocated.
            </p>
            <p className="mt-2">
              The Service is provided for informational and entertainment purposes. It should not be relied upon for tax planning, financial advice, or any official purpose. Always consult a qualified tax adviser for financial decisions.
            </p>
          </div>

          {/* 8 */}
          <div>
            <h2 className="text-lg font-bold text-slate-900">7. Share Cards</h2>
            <p className="mt-2">
              Share cards contain only aggregated totals (e.g., &quot;Total lifetime tax: £287,000&quot;) and do not include personally identifiable information such as your name, NINO, or employer details.
            </p>
            <p className="mt-2">
              By generating a share card, you acknowledge that the card URL is publicly accessible and the aggregated data on it can be viewed by anyone with the link. You are responsible for deciding whether and where to share your cards.
            </p>
          </div>

          {/* 9 */}
          <div>
            <h2 className="text-lg font-bold text-slate-900">8. Intellectual Property</h2>
            <p className="mt-2">
              All content, design, code, and branding of the Service (excluding your personal data and HMRC data) is owned by Perihelion Limited and protected by UK and international intellectual property laws. You may not copy, modify, distribute, or reverse-engineer any part of the Service without our prior written consent.
            </p>
            <p className="mt-2">
              You retain ownership of your personal data and tax data. We are granted a limited licence to process this data solely for the purpose of providing the Service.
            </p>
          </div>

          {/* 10 */}
          <div>
            <h2 className="text-lg font-bold text-slate-900">9. Acceptable Use</h2>
            <p className="mt-2">You agree not to:</p>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li>Use the Service for any unlawful purpose</li>
              <li>Attempt to access another user&apos;s account or data</li>
              <li>Interfere with, disrupt, or place an undue burden on the Service or its infrastructure</li>
              <li>Use automated tools (bots, scrapers, etc.) to access the Service without our permission</li>
              <li>Attempt to circumvent any security measures or access controls</li>
              <li>Misrepresent your identity or impersonate another person when connecting to HMRC</li>
              <li>Use the Service to create misleading or fraudulent content</li>
            </ul>
          </div>

          {/* 11 */}
          <div>
            <h2 className="text-lg font-bold text-slate-900">10. Limitation of Liability</h2>
            <p className="mt-2">
              To the maximum extent permitted by law:
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li>The Service is provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind, whether express or implied.</li>
              <li>We do not guarantee that the Service will be uninterrupted, error-free, or free from viruses or other harmful components.</li>
              <li>We are not liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Service.</li>
              <li>Our total liability for any claim arising from or related to the Service shall not exceed £100.</li>
            </ul>
            <p className="mt-2">
              Nothing in these Terms excludes or limits our liability for death or personal injury caused by negligence, fraud, or any other liability that cannot be excluded by law.
            </p>
          </div>

          {/* 12 */}
          <div>
            <h2 className="text-lg font-bold text-slate-900">11. HMRC API Availability</h2>
            <p className="mt-2">
              The Service depends on HMRC&apos;s APIs being available and functioning correctly. We are not responsible for any downtime, data errors, or service interruptions caused by HMRC&apos;s systems. If HMRC changes or discontinues their APIs, some or all features of the Service may become unavailable.
            </p>
          </div>

          {/* 13 */}
          <div>
            <h2 className="text-lg font-bold text-slate-900">12. Account Deletion</h2>
            <p className="mt-2">
              You may delete your account at any time through your account settings or by contacting us. Account deletion is permanent and irreversible — all data including tax records, calculations, HMRC tokens, and share cards will be permanently removed from our systems.
            </p>
            <p className="mt-2">
              We may suspend or terminate your account if we reasonably believe you have violated these Terms, or if required to do so by law or by HMRC.
            </p>
          </div>

          {/* 14 */}
          <div>
            <h2 className="text-lg font-bold text-slate-900">13. Privacy</h2>
            <p className="mt-2">
              Your privacy is important to us. Please refer to our <a href="/privacy" className="text-brand-700 underline">Privacy Policy</a> for details on how we collect, use, and protect your personal data.
            </p>
          </div>

          {/* 15 */}
          <div>
            <h2 className="text-lg font-bold text-slate-900">14. Changes to These Terms</h2>
            <p className="mt-2">
              We may update these Terms from time to time. We will notify you of material changes by posting the updated Terms on this page and updating the &quot;Last updated&quot; date. For significant changes, we will notify you by email. Your continued use of the Service after changes take effect constitutes acceptance of the revised Terms.
            </p>
          </div>

          {/* 16 */}
          <div>
            <h2 className="text-lg font-bold text-slate-900">15. Governing Law and Jurisdiction</h2>
            <p className="mt-2">
              These Terms are governed by and construed in accordance with the laws of England and Wales. Any disputes arising from or in connection with these Terms or the Service shall be subject to the exclusive jurisdiction of the courts of England and Wales.
            </p>
          </div>

          {/* 17 */}
          <div>
            <h2 className="text-lg font-bold text-slate-900">16. Severability</h2>
            <p className="mt-2">
              If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions shall continue in full force and effect.
            </p>
          </div>

          {/* 18 */}
          <div>
            <h2 className="text-lg font-bold text-slate-900">17. Contact Us</h2>
            <p className="mt-2">
              If you have any questions about these Terms, please contact us:
            </p>
            <ul className="mt-2 list-none space-y-1 pl-0">
              <li><strong>Email:</strong> <a href="mailto:will@perihelion.limited" className="text-brand-700 underline">will@perihelion.limited</a></li>
              <li><strong>Company:</strong> Perihelion Limited</li>
              <li><strong>Address:</strong> 35 Coppice Avenue, Great Shelford, Cambridge, CB22 5AQ, United Kingdom</li>
            </ul>
          </div>
        </section>

        <div className="mt-10 border-t border-slate-200 pt-6 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Perihelion Limited. Company registered in England and Wales.</p>
        </div>
      </div>
    </main>
  );
}
