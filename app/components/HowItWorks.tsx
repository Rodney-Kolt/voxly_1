import React from 'react'
import { ArrowRight } from 'lucide-react'

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      number: '1',
      title: 'Sign In',
      description: 'Create your account securely with one click using Google Sign-In.',
    },
    {
      number: '2',
      title: 'Create a Poll',
      description: 'Set up your poll with customizable questions and response options.',
    },
    {
      number: '3',
      title: 'Share & Collect',
      description: 'Share with your community and watch responses come in real-time.',
    },
  ]

  return (
    <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-secondary mb-4">
            How It Works
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get started in three simple steps.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Step card */}
              <div className="bg-white rounded-2xl p-8 border border-gray-200">
                {/* Number circle */}
                <div className="mb-6 inline-flex items-center justify-center w-12 h-12 bg-gradient-primary text-white rounded-full font-bold text-lg">
                  {step.number}
                </div>
                <h3 className="text-2xl font-bold text-secondary mb-3">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.description}</p>
              </div>

              {/* Arrow connector */}
              {index < steps.length - 1 && (
                <div className="hidden md:flex absolute top-1/2 -right-4 transform -translate-y-1/2">
                  <div className="w-8 h-8 flex items-center justify-center">
                    <ArrowRight className="text-primary" size={24} />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
