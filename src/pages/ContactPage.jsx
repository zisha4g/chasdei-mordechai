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

      <div className="site-page min-h-screen py-12 pt-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="text-center mb-12">
            <span className="site-eyebrow px-5 py-1.5">Contact</span>
            <h1 className="font-display mt-6 text-5xl font-semibold uppercase text-white mb-4">Get In Touch</h1>
            <p className="text-lg text-white/88">
              Have a question, want to volunteer, or just want to say hello?<br />
              We'd love to hear from you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <section className="site-shell rounded-[1.8rem] p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Contact Information</h2>
              <div className="space-y-6">
                {contactInfo.map((info, index) => {
                  const Icon = info.icon;
                  return (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#e8cc74]/12">
                          <Icon className="text-[#efd37a]" size={24} />
                        </div>
                      </div>
                      <div>
                        <h3 className="mb-1 font-semibold text-white">{info.label}</h3>
                        <p className="text-white/88">{info.value}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 border-t border-white/10 pt-8">
                <h3 className="mb-3 font-semibold text-white">Office Hours</h3>
                <div className="space-y-1 text-white/88">
                  <p>Monday - Friday: 9:00 AM - 5:00 PM</p>
                  <p>Saturday: 10:00 AM - 2:00 PM</p>
                  <p>Sunday: Closed</p>
                </div>
              </div>
            </section>

            <section className="site-shell rounded-[1.8rem] p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Send Us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="mb-2 block text-sm font-medium text-white/90">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/30 focus:border-[#efd37a] focus:outline-none focus:ring-2 focus:ring-[#efd37a]/20"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="mb-2 block text-sm font-medium text-white/90">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/30 focus:border-[#efd37a] focus:outline-none focus:ring-2 focus:ring-[#efd37a]/20"
                    placeholder="What is this about?"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-medium text-white/90">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/30 focus:border-[#efd37a] focus:outline-none focus:ring-2 focus:ring-[#efd37a]/20"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="mb-2 block text-sm font-medium text-white/90">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/30 focus:border-[#efd37a] focus:outline-none focus:ring-2 focus:ring-[#efd37a]/20"
                    placeholder="How can we help you?"
                  />
                </div>

                <Button type="submit" disabled={sending} className="w-full rounded-full bg-[#e8cc74] py-6 font-extrabold uppercase tracking-[0.12em] text-[#091031] hover:bg-[#f1d989]">
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