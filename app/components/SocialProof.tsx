import React from 'react'
import { Star, Users, Zap } from 'lucide-react'

export const SocialProof: React.FC = () => {
  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Product Manager',
      company: 'Tech Startup',
      image: '👩‍💼',
      quote: 'Voxly helped us gather customer feedback faster than any other tool. Our decision-making is now data-driven and collaborative.',
      rating: 5
    },
    {
      name: 'James Rodriguez',
      role: 'Community Organizer',
      company: 'Local NGO',
      image: '👨‍💻',
      quote: 'Setting up polls is incredibly easy. My team loves how we can instantly see what the community thinks about important issues.',
      rating: 5
    },
    {
      name: 'Emma Wilson',
      role: 'Team Lead',
      company: 'Design Agency',
      image: '👩‍🎨',
      quote: 'Voxly replaced our outdated survey tools. The real-time results and discussion features are game-changers.',
      rating: 5
    },
  ]

  const stats = [
    {
      icon: Users,
      value: '1,000+',
      label: 'Active Users'
    },
    {
      icon: Zap,
      value: '50,000+',
      label: 'Polls Created'
    },
    {
      icon: Star,
      value: '4.8/5',
      label: 'Average Rating'
    }
  ]

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-secondary mb-4">
            Loved by Teams Everywhere
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            See why thousands of teams trust Voxly for real-time polling and decision-making.
          </p>
        </div>

        {/* Stats row */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
                  <Icon size={24} className="text-blue-600" />
                </div>
                <p className="text-3xl font-bold text-secondary mb-2">{stat.value}</p>
                <p className="text-gray-600">{stat.label}</p>
              </div>
            )
          })}
        </div>

        {/* Testimonials */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-xl transition-all duration-300"
            >
              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {Array(testimonial.rating)
                  .fill(null)
                  .map((_, i) => (
                    <Star key={i} size={18} className="fill-yellow-400 text-yellow-400" />
                  ))}
              </div>

              {/* Quote */}
              <p className="text-gray-700 leading-relaxed mb-6 italic">
                "{testimonial.quote}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center text-xl">
                  {testimonial.image}
                </div>
                <div>
                  <p className="font-bold text-secondary text-sm">{testimonial.name}</p>
                  <p className="text-gray-600 text-xs">
                    {testimonial.role} at {testimonial.company}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust section */}
        <div className="mt-16 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-2xl p-8 sm:p-10 text-center">
          <h3 className="text-2xl font-bold text-secondary mb-6">
            Why Teams Choose Voxly
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <p className="text-2xl font-bold text-blue-600 mb-2">✅</p>
              <p className="font-semibold text-secondary mb-1">100% Free</p>
              <p className="text-sm text-gray-600">No hidden costs, no credit card required</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600 mb-2">⚡</p>
              <p className="font-semibold text-secondary mb-1">Lightning Fast</p>
              <p className="text-sm text-gray-600">Real-time results with zero latency</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600 mb-2">🔒</p>
              <p className="font-semibold text-secondary mb-1">Secure & Private</p>
              <p className="text-sm text-gray-600">Your data is encrypted and protected</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
