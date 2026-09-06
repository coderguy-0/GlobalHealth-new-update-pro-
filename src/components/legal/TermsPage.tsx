import React from 'react';
import { ArrowLeft, Heart, Home as HomeIcon, ChevronRight } from 'lucide-react';
import { NavigationTab } from '../../types';
import { TERMS_EFFECTIVE_DATE, LEGAL_PLACEHOLDERS } from '../../lib/policyVersions';

interface TermsPageProps {
  onNavigate: (tab: NavigationTab) => void;
}

/** A short, reusable legal-section wrapper. */
const Section: React.FC<{ n: string; title: string; children: React.ReactNode }> = ({ n, title, children }) => (
  <section aria-labelledby={`tc-${n}`} className="border-b border-slate-200/70 py-6 last:border-b-0">
    <h2 id={`tc-${n}`} className="flex items-baseline gap-2 text-[17px] font-bold tracking-tight text-slate-900">
      <span className="text-medical-600">{n}.</span> {title}
    </h2>
    <div className="mt-2.5 space-y-2 text-[13px] leading-relaxed text-slate-600">{children}</div>
  </section>
);

/**
 * GlobalHealth Terms & Conditions — dedicated full-page document.
 * All 41 sections from the product Terms are presented in a readable,
 * searchable-by-browser, print-friendly layout. Legal placeholders are
 * visibly marked until the real entity details are supplied.
 */
export const TermsPage: React.FC<TermsPageProps> = ({ onNavigate }) => (
  <div className="bg-slate-50">
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 sm:py-10">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
        <button type="button" onClick={() => onNavigate('home')} className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 transition hover:bg-slate-100 hover:text-medical-700">
          <HomeIcon className="h-3.5 w-3.5" /> Home
        </button>
        <ChevronRight className="h-3.5 w-3.5 text-slate-300" aria-hidden="true" />
        <span className="rounded-lg px-2 py-1 font-semibold text-slate-700" aria-current="page">Terms &amp; Conditions</span>
      </nav>

      <article className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lift">
        {/* Document header */}
        <header className="border-b border-slate-200 bg-gradient-to-br from-slate-900 to-slate-800 px-6 py-8 text-white sm:px-10">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-medical-500 to-medical-700 text-white">
              <Heart className="h-5 w-5 fill-white/20" />
            </span>
            <span className="text-lg font-bold tracking-tight">GlobalHealth</span>
          </div>
          <h1 className="mt-4 text-2xl font-extrabold tracking-tight sm:text-3xl">Terms &amp; Conditions</h1>
          <p className="mt-2 text-xs text-slate-300">
            Effective Date: <strong className="text-white">{TERMS_EFFECTIVE_DATE}</strong> · Last Updated:{' '}
            <strong className="text-white">{TERMS_EFFECTIVE_DATE}</strong> · Version:{' '}
            <strong className="text-white">GH-TC-2026-01</strong>
          </p>
        </header>

        <div className="px-6 py-6 sm:px-10 sm:py-8">
          {/* Legal placeholders notice */}
          <div className="mb-8 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs leading-relaxed text-amber-950" role="note">
            <strong>Legal entity information pending:</strong> This document is a product Terms draft. Before launch,
            the placeholders below must be replaced with the actual GlobalHealth legal entity, registered address,
            contact details and governing-law specifics. The presence of these sections does not by itself make the
            site legally compliant — a legal review against the applicable framework (including, for an India
            deployment, the Digital Personal Data Protection Act, 2023 and the notified DPDP Rules, 2025) is required.
          </div>

          <div className="space-y-1">
            <Section n="1" title="Acceptance of these Terms">
              <p>
                By selecting <strong>“I Agree,” “Accept Terms &amp; Conditions,” “Create Account,” “Log In,”</strong> or by
                otherwise accessing or using a service for which these Terms apply, you confirm that:
              </p>
              <ul className="list-disc space-y-1 pl-5">
                <li>You have read and understood these Terms.</li>
                <li>You agree to be legally bound by these Terms to the extent permitted by applicable law.</li>
                <li>You will use GlobalHealth only for lawful purposes.</li>
                <li>The information you provide is accurate, current, and complete to the best of your knowledge.</li>
                <li>You are responsible for activity conducted through your account.</li>
                <li>You will comply with applicable laws and regulations while using the platform.</li>
              </ul>
              <p>Where applicable, additional consent may be requested for specific features involving health information, communications, payments, appointments, pharmacy services, or other sensitive functions.</p>
            </Section>

            <Section n="2" title="Eligibility">
              <p>
                GlobalHealth services may have different age or eligibility requirements depending on the service and
                applicable law. You must provide truthful information regarding your eligibility. Where a service
                requires a person to be legally able to provide consent, the person must satisfy the applicable
                requirements before using that service. Where permitted, a parent, legal guardian, or authorized
                representative may use certain services on behalf of another person, subject to applicable law and
                GlobalHealth requirements. GlobalHealth may restrict, suspend, or terminate accounts that do not
                satisfy applicable eligibility requirements.
              </p>
            </Section>

            <Section n="3" title="Account Registration">
              <p>
                Certain GlobalHealth features may require registration. When creating an account, you may be required
                to provide information such as your full name, email address, mobile number, date of birth or
                age-related information, login credentials, location information, and other information required for
                the selected service. You agree to provide information that is accurate and not misleading, to update
                your account information when reasonably necessary, and to permit verification where reasonably needed
                to maintain platform security, prevent fraud, or provide a requested service.
              </p>
            </Section>

            <Section n="4" title="Account Security">
              <p>
                You are responsible for maintaining the confidentiality of your login credentials. You should keep your
                password confidential, avoid sharing authentication codes, use appropriate security practices, log out
                from shared or public devices, and notify GlobalHealth promptly if you believe your account has been
                compromised. You must not attempt to access another person&apos;s account without authorization.
                GlobalHealth may require additional verification, password resets, account recovery, or other security
                measures.
              </p>
            </Section>

            <Section n="5" title="Login and Authentication">
              <p>
                By logging in, you authorize GlobalHealth to authenticate your account using the information and
                verification methods associated with your account. Depending on the service, authentication may involve
                email and password, mobile number and OTP, multi-factor authentication, identity or account
                verification, or other security mechanisms. GlobalHealth may temporarily restrict access if unusual
                activity, suspected fraud, unauthorized access, or security risks are detected.
              </p>
            </Section>

            <Section n="6" title="GlobalHealth Services">
              <p>
                Depending on availability, GlobalHealth may provide features including healthcare information, disease
                and symptom information, laboratory and diagnostic information, medicine information, healthcare
                professional discovery, hospital and clinic discovery, medical maps, pharmacy discovery, verified
                pharmacy partner services, health records and personal health dashboards, appointment-related
                functionality, health calculators, wellness information, healthcare news, community discussions,
                AI-assisted healthcare information, educational resources, and other healthcare-related digital
                services. Not every feature is available in every location or to every user. GlobalHealth may modify,
                add, suspend, or discontinue features subject to applicable law.
              </p>
            </Section>

            <Section n="7" title="Personal Health Information">
              <p>
                Some GlobalHealth features may allow users to store, organize, view, or manage personal health
                information. You understand that health information can be highly sensitive. You are responsible for
                ensuring that information you voluntarily enter into your account is accurate and appropriate for the
                intended purpose. GlobalHealth will handle information according to its applicable Privacy Policy and
                other applicable privacy requirements. You should not enter another person&apos;s health information unless
                you are authorized to do so. GlobalHealth does not guarantee that stored information will always be
                available, error-free, or permanently retained; you should maintain appropriate copies of important
                medical records when necessary.
              </p>
            </Section>

            <Section n="8" title="Medical Information Disclaimer">
              <p className="font-semibold text-slate-800">
                GLOBALHEALTH IS NOT A SUBSTITUTE FOR A QUALIFIED HEALTHCARE PROFESSIONAL.
              </p>
              <p>
                Information available through GlobalHealth is provided primarily for general educational and
                informational purposes. Information about diseases, symptoms, medicines, laboratory tests, nutrition,
                wellness, treatments, medical conditions, healthcare procedures, and health risks should not be
                interpreted as personalized medical diagnosis, treatment, or professional medical advice unless
                explicitly provided by an appropriately qualified professional through a service specifically intended
                for that purpose. Do not delay, avoid, or discontinue professional medical care based solely on
                information obtained from GlobalHealth. For urgent or emergency medical situations, contact appropriate
                local emergency services or seek immediate professional medical care.
              </p>
            </Section>

            <Section n="9" title="Doctors and Healthcare Professionals">
              <p>
                GlobalHealth may provide information or discovery tools relating to healthcare professionals, including
                name, specialty, qualifications, location, availability, professional information, and
                appointment-related information. Where healthcare professionals are listed, GlobalHealth does not
                necessarily employ, supervise, or control those professionals. A listing should not automatically be
                interpreted as an endorsement, guarantee of competence, treatment outcome, or professional
                relationship. Any medical consultation, diagnosis, treatment, prescription, or professional service
                provided by a healthcare professional is subject to the relationship between the user and that
                professional.
              </p>
            </Section>

            <Section n="10" title="Appointments">
              <ul className="list-disc space-y-1 pl-5">
                <li>Appointment availability may change.</li>
                <li>Appointment requests may require confirmation.</li>
                <li>Appointment times may be changed or cancelled.</li>
                <li>Healthcare professionals or facilities may impose additional terms.</li>
                <li>GlobalHealth cannot guarantee that an appointment will occur exactly as displayed.</li>
                <li>Users are responsible for attending confirmed appointments.</li>
                <li>Cancellation or missed-appointment policies may apply.</li>
              </ul>
              <p>Additional terms, fees, or requirements may apply to specific providers.</p>
            </Section>

            <Section n="11" title="Medicines and Pharmacy Services">
              <p>
                GlobalHealth may provide medicine-related information (including name, brand, generic name, active
                ingredients, strength, dosage form, uses, precautions, side effects, warnings, storage, manufacturer,
                and prescription status) and may facilitate discovery of verified pharmacy partners. This information
                is provided for informational purposes and does not replace professional medical advice. Users must
                not rely solely on GlobalHealth to determine whether a medicine is appropriate for them. Prescription
                medicines must only be obtained, prescribed, supplied, or used in accordance with applicable law and
                appropriate professional advice. GlobalHealth does not encourage users to obtain prescription
                medicines without a valid prescription where one is legally required.
              </p>
            </Section>

            <Section n="12" title="Verified Pharmacy Partners">
              <p>
                Where available, medicines may be purchased through participating or verified pharmacy partners.
                GlobalHealth may provide pharmacy information and facilitate interaction between users and pharmacy
                partners, but a pharmacy transaction may be governed by additional terms belonging to the pharmacy.
                Pharmacies are responsible for product availability, product authenticity, pricing, prescription
                verification, dispensing, delivery, refunds and cancellations, applicable taxes, and compliance with
                applicable pharmacy and medicine laws. GlobalHealth does not guarantee the availability, suitability,
                quality, authenticity, or delivery of a product unless expressly stated in a specific service
                agreement.
              </p>
            </Section>

            <Section n="13" title="Laboratory and Diagnostic Information">
              <p>
                GlobalHealth may provide information about laboratory tests, diagnostic procedures, reference ranges,
                and healthcare facilities. Reference ranges and interpretations may vary according to laboratory,
                testing method, equipment, patient characteristics, age, sex, clinical circumstances, and other
                factors. Laboratory information should not be interpreted without appropriate professional context.
              </p>
            </Section>

            <Section n="14" title="AI Assistant">
              <p>
                GlobalHealth may provide an AI-powered healthcare assistant intended to provide general informational
                and educational assistance. AI-generated information may contain errors, may be incomplete, may not
                reflect the latest medical information, may not account for an individual&apos;s complete medical history,
                must not be treated as a diagnosis, and must not replace qualified medical advice. Do not use the AI
                Assistant as the sole basis for making urgent or high-risk healthcare decisions. GlobalHealth may store
                or process conversations according to the applicable Privacy Policy and feature-specific disclosures.
                Users should avoid unnecessarily sharing highly sensitive personal information with AI systems unless
                the feature specifically requires and supports such information.
              </p>
            </Section>

            <Section n="15" title="Health Calculators">
              <p>
                GlobalHealth may provide calculators such as BMI, age, calorie-related calculations, pregnancy-related
                calculations, and other educational calculators. These calculators are intended for informational
                purposes only. Results may be estimates and should not automatically be treated as medical diagnoses
                or professional recommendations.
              </p>
            </Section>

            <Section n="16" title="Community">
              <p>
                GlobalHealth may provide community features that allow users to create posts, comment, follow users,
                participate in discussions, share experiences, and interact with healthcare-related communities. Users
                are responsible for content they publish. Community content represents the views of the person posting
                it and does not necessarily represent GlobalHealth&apos;s views. Users must not harass others, threaten
                others, bully others, impersonate others, share unlawful content, intentionally spread dangerous
                misinformation, post private information about another person without authorization, upload malicious
                software, promote illegal activities, or abuse community functionality. GlobalHealth may remove
                content or restrict accounts where permitted by applicable law and platform rules.
              </p>
            </Section>

            <Section n="17" title="User Content">
              <p>
                By submitting content to GlobalHealth, including posts, comments, reviews, images, messages, or other
                material, you confirm that you have the right to submit the content, you are not knowingly violating
                another person&apos;s rights, the content does not unlawfully disclose another person&apos;s private
                information, and the content complies with these Terms. You retain ownership of your content, subject
                to the rights necessary for GlobalHealth to host, display, process, transmit, and operate the relevant
                service. You should not upload content that you do not have permission to share.
              </p>
            </Section>

            <Section n="18" title="Messaging and Communication">
              <p>
                Where communication features are available, users must use them responsibly. You must not use
                GlobalHealth communication tools to spam users, send fraudulent messages, harass others, send
                malicious links or files, impersonate healthcare professionals or organizations, collect personal
                information improperly, or conduct unlawful activities. GlobalHealth may apply reasonable safety and
                security controls to communications consistent with applicable law and its Privacy Policy.
              </p>
            </Section>

            <Section n="19" title="Health Record and Doctor Access">
              <p>
                Certain features may allow users to control access to selected health information. Where available,
                users should review access permissions carefully, access should only be granted to authorized persons,
                users should revoke access when it is no longer appropriate, and GlobalHealth may log access activity
                for security and auditing purposes where permitted by law. GlobalHealth does not guarantee that every
                third-party healthcare provider uses the same record system, standards, or information format.
              </p>
            </Section>

            <Section n="20" title="Payments">
              <p>
                Certain GlobalHealth services may involve payment. Where payment is required, prices will be presented
                where applicable, applicable taxes or additional charges may apply, payment processors or service
                providers may have separate terms, transactions may be subject to verification, and refunds may be
                governed by the applicable service or provider policy. GlobalHealth does not guarantee that all
                payment methods will always be available.
              </p>
            </Section>

            <Section n="21" title="Refunds, Cancellations, and Disputes">
              <p>
                Refund and cancellation terms may vary depending on the service. Where a transaction is provided by a
                third-party provider, the provider&apos;s applicable cancellation and refund policy may apply. Users should
                review relevant transaction information before completing a purchase or booking. Nothing in these
                Terms removes rights that cannot lawfully be excluded under applicable law.
              </p>
            </Section>

            <Section n="22" title="Third-Party Services">
              <p>
                GlobalHealth may connect users with third-party doctors, hospitals, clinics, pharmacies, laboratories,
                healthcare providers, payment services, technology services, and other partners. Third-party services
                may have separate terms, privacy policies, fees, and requirements. GlobalHealth is not responsible for
                the independent acts or omissions of third parties except to the extent required by applicable law.
              </p>
            </Section>

            <Section n="23" title="Information Accuracy">
              <p>
                GlobalHealth aims to provide useful and accurate information, but healthcare information may change.
                Information can become outdated because of new medical research, changes in clinical recommendations,
                regulatory changes, product changes, medicine availability, and changes in healthcare provider
                information. GlobalHealth does not warrant that every piece of information is complete, current, or
                error-free. Users should verify important healthcare decisions with an appropriate qualified
                professional.
              </p>
            </Section>

            <Section n="24" title="Prohibited Use">
              <ul className="list-disc space-y-1 pl-5">
                <li>Break the law.</li>
                <li>Access another person&apos;s account without authorization.</li>
                <li>Circumvent security controls.</li>
                <li>Introduce malware or malicious code.</li>
                <li>Scrape or collect information through unauthorized automated systems.</li>
                <li>Reverse engineer prohibited portions of the platform.</li>
                <li>Interfere with platform operations.</li>
                <li>Misrepresent your identity.</li>
                <li>Provide knowingly false healthcare information to deceive others.</li>
                <li>Abuse community, messaging, appointment, or pharmacy features.</li>
                <li>Use the platform to cause harm to another person.</li>
                <li>Attempt unauthorized access to systems or databases.</li>
                <li>Use GlobalHealth in a manner that violates applicable laws.</li>
              </ul>
            </Section>

            <Section n="25" title="Security">
              <p>
                GlobalHealth takes reasonable measures designed to protect its systems and user information. However,
                no internet-based service can guarantee absolute security. You acknowledge that internet transmissions
                may involve risks, devices may be compromised, third-party services may experience incidents, and
                unauthorized access may occur despite reasonable safeguards. You are responsible for maintaining the
                security of your own devices and credentials.
              </p>
            </Section>

            <Section n="26" title="Privacy">
              <p>
                Our handling of personal information is described in the <strong>GlobalHealth Privacy Policy</strong>,
                which should be read together with these Terms. By using services that require personal information,
                you acknowledge that information may need to be collected and processed to provide those services,
                subject to applicable law and the Privacy Policy. Additional consent may be requested for specific
                categories of data or services.
              </p>
            </Section>

            <Section n="27" title="Intellectual Property">
              <p>
                GlobalHealth and its licensors may own rights in website design, branding, logos, software, interface
                elements, graphics, original text, databases, features, documentation, and other proprietary
                materials. You may use GlobalHealth only as permitted by these Terms and applicable law. You must not
                reproduce, distribute, modify, sell, or commercially exploit protected GlobalHealth materials without
                appropriate authorization, except where legally permitted.
              </p>
            </Section>

            <Section n="28" title="Trademarks">
              <p>
                “GlobalHealth” and associated logos, designs, names, and branding may be trademarks or protected
                identifiers. You may not use GlobalHealth branding in a way that suggests unauthorized sponsorship,
                partnership, endorsement, or affiliation.
              </p>
            </Section>

            <Section n="29" title="Service Availability">
              <p>
                GlobalHealth may occasionally be unavailable because of maintenance, updates, technical problems,
                security incidents, internet or infrastructure failures, third-party service failures, or events
                beyond reasonable control. We may modify or discontinue features where reasonably necessary.
              </p>
            </Section>

            <Section n="30" title="Account Suspension or Termination">
              <p>
                GlobalHealth may restrict, suspend, or terminate an account where permitted by law if these Terms are
                violated, fraud is suspected, security risks are detected, the account is being abused, the platform
                is being used unlawfully, required information is materially false or misleading, or continued access
                presents a significant safety or security concern. Users may also close their accounts subject to
                applicable service requirements. Certain information may need to be retained where legally required or
                reasonably necessary for legitimate purposes.
              </p>
            </Section>

            <Section n="31" title="Disclaimers">
              <p>TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, GLOBALHEALTH DOES NOT GUARANTEE THAT:</p>
              <ul className="list-disc space-y-1 pl-5">
                <li>The platform will always be available.</li>
                <li>Information will always be complete or error-free.</li>
                <li>Services will meet every user&apos;s individual requirements.</li>
                <li>Third-party services will always be available.</li>
                <li>AI-generated information will always be correct.</li>
                <li>Medical information will result in a particular health outcome.</li>
                <li>Appointments, products, medicines, or healthcare services will always be available.</li>
              </ul>
              <p>Nothing in these Terms excludes a right or liability that cannot lawfully be excluded.</p>
            </Section>

            <Section n="32" title="Limitation of Liability">
              <p>
                To the maximum extent permitted by applicable law, GlobalHealth and its relevant affiliates, officers,
                employees, contractors, and service providers will not be responsible for losses arising from use of
                the platform where such liability cannot reasonably be attributed to GlobalHealth or where applicable
                law permits limitation. Nothing in these Terms is intended to exclude liability that cannot legally be
                excluded or limited.
              </p>
            </Section>

            <Section n="33" title="Indemnification">
              <p>
                To the extent permitted by applicable law, you may be responsible for losses or claims resulting from
                your unlawful use of the platform, your violation of these Terms, your infringement of another
                person&apos;s rights, your unauthorized use of another person&apos;s information, or your misuse of platform
                services. This section applies only to the extent legally permitted.
              </p>
            </Section>

            <Section n="34" title="Changes to These Terms">
              <p>
                GlobalHealth may update these Terms from time to time. When material changes are made, GlobalHealth may
                provide notice through reasonable means, such as website notices, in-app notices, email, or account
                notifications. Your continued use of the service after an effective update may constitute acceptance
                where permitted by applicable law. The current version and “Last Updated” date are displayed clearly.
              </p>
            </Section>

            <Section n="35" title="Governing Law">
              <p>
                These Terms will be governed by the laws applicable to the GlobalHealth operating entity and the
                user&apos;s applicable jurisdiction, subject to mandatory consumer and other legal protections. For an
                India-based GlobalHealth operation, the final governing-law and jurisdiction clause should be prepared
                specifically for the actual legal entity, registered office, applicable state, and services offered.
              </p>
            </Section>

            <Section n="36" title="Dispute Resolution">
              <p>
                Where legally permitted, disputes should first be raised with GlobalHealth through its designated
                support process so the parties have an opportunity to resolve the issue. Additional dispute-resolution
                procedures may apply depending on the user&apos;s jurisdiction and the relevant service. Nothing in this
                section prevents a user from exercising rights that cannot legally be waived.
              </p>
            </Section>

            <Section n="37" title="Severability">
              <p>
                If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions will
                continue to apply to the extent permitted by law.
              </p>
            </Section>

            <Section n="38" title="Entire Agreement">
              <p>
                These Terms, together with applicable policies and service-specific terms, form the relevant agreement
                between you and GlobalHealth concerning your use of the applicable services.
              </p>
            </Section>

            <Section n="39" title="No Waiver">
              <p>
                Failure by GlobalHealth to enforce a provision does not automatically mean that GlobalHealth has
                waived its right to enforce that provision later.
              </p>
            </Section>

            <Section n="40" title="Contact and Support">
              <p>
                For questions, complaints, account issues, privacy requests, or legal notices, users should be
                provided with the official GlobalHealth contact information:
              </p>
              <div className="rounded-xl bg-slate-50 p-4 font-mono text-xs text-slate-700 ring-1 ring-slate-200">
                <p><strong>GlobalHealth</strong></p>
                <p>Legal Entity: {LEGAL_PLACEHOLDERS.legalEntity}</p>
                <p>Email: {LEGAL_PLACEHOLDERS.supportEmail}</p>
                <p>Privacy Email: {LEGAL_PLACEHOLDERS.privacyEmail}</p>
                <p>Grievance Contact: {LEGAL_PLACEHOLDERS.grievanceContact}</p>
                <p>Registered Address: {LEGAL_PLACEHOLDERS.registeredAddress}</p>
                <p>Website: {LEGAL_PLACEHOLDERS.website}</p>
              </div>
            </Section>

            <Section n="41" title="User Acknowledgement">
              <p>
                By selecting <strong>“I Agree”</strong> during registration or when acceptance is required, you
                acknowledge that you have read these Terms &amp; Conditions, you understand the nature of the
                GlobalHealth platform, you understand that general healthcare information is not a substitute for
                professional medical care, you agree to use the platform responsibly and lawfully, you agree to the
                applicable Privacy Policy, and you understand that individual services may have additional terms.
              </p>
              <p className="rounded-xl bg-medical-50 p-3.5 text-xs text-medical-900 ring-1 ring-medical-200">
                Your acceptance is recorded together with the applicable Terms version, date/time, and other
                legally appropriate consent records (see the Privacy Policy and your account&apos;s Privacy &amp;
                Consent settings).
              </p>
            </Section>
          </div>

          {/* Back to website */}
          <div className="mt-10 flex justify-center">
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-soft transition hover:border-medical-200 hover:bg-medical-50 hover:text-medical-800"
            >
              <ArrowLeft className="h-4 w-4" /> Back to GlobalHealth
            </button>
          </div>
        </div>
      </article>
    </div>
  </div>
);
