import AnimatedText from '@/components/AnimatedText'
import React from 'react'

const PrivacyPolicyPage = () => {
  return (
    <div className="padding-container max-container py-8 px-4">
      <AnimatedText  text={"Privacy Policy"} />

      <p><strong>Effective Date:</strong> 15th September 2023</p>
      <p><strong>Last Updated:</strong> 15th October 2023</p>

      <p className='text-justify'>At Realhive consultants, we value your privacy and are committed to protecting your personal information. This Privacy Policy outlines how we collect, use, disclose, and safeguard your data when you interact with our services and website. By using our services, you consent to the practices described in this policy.</p>

      <h2 className='font-semibold py-2'>1. Information We Collect:</h2>
      <p>We may collect the following types of information:</p>
      <ul>
          <li><strong>Personal Information:</strong> This includes but is not limited to your name, email address, contact information, and any other information you provide when contacting us.</li>
          <li><strong>Usage Information:</strong> We may collect data about how you interact with our website, including your IP address, device type, browser, pages viewed, and other similar information.</li>
      </ul>

      <h2 className='font-semibold py-2'>2. How We Use Your Information:</h2>
      <p>We use your information for the following purposes:</p>
      <ol>
          <li>To provide and maintain our services.</li>
          <li>To respond to your inquiries and requests.</li>
          <li>To improve and personalize your experience.</li>
          <li>To analyze website usage and optimize our services.</li>
      </ol>

      <h2 className='font-semibold py-2'>3. Information Sharing:</h2>
      <p>We do not sell, trade, or otherwise transfer your personal information to third parties. We may share data with trusted service providers who assist us in operating our website, and these providers are required to maintain the confidentiality of your information.</p>

      <h2 className='font-semibold py-2'>4. Data Security:</h2>
      <p>We employ security measures to protect your personal information from unauthorized access, disclosure, alteration, or destruction. However, please be aware that no method of online transmission or storage is completely secure, and we cannot guarantee absolute data security.</p>

      <h2 className='font-semibold py-2'>5. Your Choices:</h2>
      <p>You can control the personal information you provide to us. You can opt not to provide certain information or request to update or delete your information by contacting us.</p>

      <h2 className='font-semibold py-2'>6. Cookies:</h2>
      <p>We use cookies to enhance your experience on our website. You can choose to disable cookies through your browser settings, but this may affect your ability to use some features on our website.</p>

      <h2 className='font-semibold py-2'>7. Changes to this Privacy Policy:</h2>
      <p>We may update this Privacy Policy from time to time. Any changes will be posted on this page, and the revised policy will take effect on the date of posting.</p>

      <h2 className='font-semibold py-2'>8. Contact Us:</h2>
      <p>If you have any questions, concerns, or requests related to this Privacy Policy, please contact us at [Insert Contact Information].</p>

      <p>Thank you for trusting Realhive consultants with your personal information. We are dedicated to protecting your privacy and ensuring a secure, reliable, and enjoyable experience when using our services.</p>
    </div>
  )
}

export default PrivacyPolicyPage
