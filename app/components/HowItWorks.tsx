import React from 'react'
import { ArrowRight, LogIn, PlusSquare, Send } from 'lucide-react'

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      number: '1',
      icon: LogIn,
      title: 'Sign In Free',
      description: 'Create your account with one click using Google. No credit card required.',
      time: '30 seconds'
    },
    {
      number: '2',
      icon: PlusSquare,
      title: 'Create a Poll',
      description: 'Add your question, customize options, and set a description or image.',
      time: '2 minutes'
    },
    {
      number: '3',
      icon: Send,
      title: 'Share & Gather',
      description: 'Copy the link, share with your community, and watch responses come in real-time.',
      time: 'Instant'
    },
  ]

  return (
    <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white via-blue-50 to-white">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-secondary mb-4">
            Get Started in Minutes
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Three simple steps to create your first poll and start gathering feedback.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <div key={index} className="relative">
                {/* Step card */}
                <div className="bg-white rounded-2xl p-8 border border-gray-200 hover:shadow-lg transition-all duration-300 h-full">
                  {/* Number circle */}
                  <div className="mb-6 inline-flex items-center justify-center w-14 h-14 bg-gradient-primary text-white rounded-full font-bold text-xl">
                    {step.number}
                  </div>

                  {/* Icon */}
                  <div className="mb-4 inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg">
                    <Icon size={24} className="text-blue-600" />
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold text-secondary mb-2">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed mb-4">{step.description}</p>

                  {/* Time badge */}
                  <div className="pt-4 border-t border-gray-200">
                    <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full">
                      ⏱️ {step.time}
                    </span>
                  </div>
                </div>

                {/* Arrow connector */}
                {index < steps.length - 1 && (
                  <div className="hidden md:flex absolute top-1/3 -right-4 transform -translate-y-1/2 z-10">
                    <div className="w-8 h-8 flex items-center justify-center bg-white border border-gray-200 rounded-full">
                      <ArrowRight className="text-primary" size={20} />
                    </div>
                  </div>
                )}
            </div>
            )
          })}
        </div>

        {/* Secondary CTA */}
        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-6">
            Questions? We've got answers. View our <a href="#faq" className="text-primary font-semibold hover:underline">FAQ</a> or <a href="#contact" className="text-primary font-semibold hover:underline">contact support</a>.
          </p>
        </div>
      </div>
    </section>
  )
}
