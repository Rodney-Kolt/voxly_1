import React from 'react'
import { BarChart3, MessageCircle, Users } from 'lucide-react'

export const Features: React.FC = () => {
  const features = [
    {
      icon: BarChart3,
      title: 'Create Polls',
      description: 'Easily create and customize polls to gather insights from your audience in seconds.',
    },
    {
      icon: Users,
      title: 'Vote & Engage',
      description: 'Let your community vote on important topics and see results update in real-time.',
    },
    {
      icon: MessageCircle,
      title: 'Comment & Discuss',
      description: 'Foster meaningful conversations with built-in commenting and discussion threads.',
    },
  ]

  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-secondary mb-4">
            Powerful Features
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Everything you need to create engaging polls and gather meaningful feedback.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className="group p-8 border border-gray-200 rounded-2xl hover:border-primary hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="mb-6 inline-flex items-center justify-center w-14 h-14 bg-blue-100 rounded-lg group-hover:bg-gradient-primary group-hover:text-white transition">
                  <Icon size={28} className="text-blue-600 group-hover:text-white transition" />
                </div>
                <h3 className="text-2xl font-bold text-secondary mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
