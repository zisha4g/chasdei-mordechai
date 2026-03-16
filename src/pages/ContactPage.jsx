import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import emailjs from '@emailjs/browser';

// ── EmailJS config ──────────────────────────────────────────────
// 1. Sign up free at https://www.emailjs.com
// 2. Add Email Service (Gmail) → copy Service ID
// 3. Create Email Template → copy Template ID
// 4. Go to Account → API Keys → copy Public Key
// 5. Replace the three values below
const EMAILJS_SERVICE_ID  = 'service_c77b33i';
const EMAILJS_TEMPLATE_ID = 'template_6jed4ri';
const EMAILJS_PUBLIC_KEY  = '187A-6-PkbbJk207H';
// ────────────────────────────────────────────────────────────────

const ContactPage = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [sending, setSending] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          name:    formData.name,
          email:   formData.email,
          title:   formData.subject || `Message from ${formData.name}`,
          message: formData.message,
        },
        EMAILJS_PUBLIC_KEY
      );
      toast({
        title: 'Message sent!',
        description: "We received your message and will get back to you soon.",
        duration: 5000,
      });
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      toast({
        title: 'Could not send message',
        description: 'Please email us directly at office@chasdeimordechai.org',
        variant: 'destructive',
        duration: 6000,
      });
    } finally {
      setSending(false);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      label: 'Email',
      value: 'office@chasdeimordechai.org',
    },
    {
      icon: Phone,
      label: 'Phone',
      value: '(845) 474-8585',
    },
    {
      icon: MapPin,
      label: 'Address',
      value: '35 Ashel Ln, Monsey NY 10952',
    },
  ];

  return (
    <>
      <Helmet>
        <title>Contact Us | Chasdei Mordechai</title>
        <meta
          name="description"
          content="Get in touch with Chasdei Mordechai. Send us a message, give us a call, or reach out by email. We'd love to hear from you."
        />
      </Helmet>

      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Get In Touch</h1>
            <p className="text-lg text-gray-600">
              Have a question, want to volunteer, or just want to say hello?<br />
              We'd love to hear from you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Contact Information */}
            <section className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>
              <div className="space-y-6">
                {contactInfo.map((info, index) => {
                  const Icon = info.icon;
                  return (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <Icon className="text-blue-600" size={24} />
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">{info.label}</h3>
                        <p className="text-gray-700">{info.value}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-3">Office Hours</h3>
                <div className="text-gray-700 space-y-1">
                  <p>Monday - Friday: 9:00 AM - 5:00 PM</p>
                  <p>Saturday: 10:00 AM - 2:00 PM</p>
                  <p>Sunday: Closed</p>
                </div>
              </div>
            </section>

            {/* Contact Form */}
            <section className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Send Us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent text-gray-900 bg-white"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent text-gray-900 bg-white"
                    placeholder="What is this about?"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent text-gray-900 bg-white"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent text-gray-900 bg-white resize-none"
                    placeholder="How can we help you?"
                  />
                </div>

                <Button type="submit" disabled={sending} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3">
                  <Send className="mr-2" size={18} />
                  {sending ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactPage;