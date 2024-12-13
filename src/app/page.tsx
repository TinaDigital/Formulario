'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Logo from '../../public/LOGO-TINA.png'
import Image from 'next/image'

interface FormData {
  businessName: string
  industryType: string
  websitePurpose: string
  targetAudience: string
  desiredFeatures: string[]
  contentManagement: string
  designPreferences: string
  competitorWebsites: string
  budget: string
  deadline: string
  additionalComments: string
}

const initialFormData: FormData = {
  businessName: '',
  industryType: '',
  websitePurpose: '',
  targetAudience: '',
  desiredFeatures: [],
  contentManagement: '',
  designPreferences: '',
  competitorWebsites: '',
  budget: '',
  deadline: '',
  additionalComments: ''
}

const questions = [
  {
    id: 'businessName',
    question: '¿Cuál es el nombre de tu negocio?',
    type: 'text',
    placeholder: 'Ej.: Panadería Delicias Caseras'
  },
  {
    id: 'industryType',
    question: '¿En qué industria opera tu negocio?',
    type: 'text',
    placeholder: 'Ej.: Alimentación, Tecnología, Salud'
  },
  {
    id: 'websitePurpose',
    question: '¿Cuál es el propósito principal de tu sitio web?',
    type: 'select',
    options: [
      { value: 'informar', label: 'Informar sobre productos o servicios' },
      { value: 'vender', label: 'Vender productos en línea' },
      { value: 'portafolio', label: 'Mostrar un portafolio de trabajos' },
      { value: 'captar', label: 'Captar clientes potenciales' },
      { value: 'blog', label: 'Publicar contenido (blog)' }
    ]
  },
  {
    id: 'targetAudience',
    question: '¿Quién es tu público objetivo?',
    type: 'text',
    placeholder: 'Ej.: Jóvenes profesionales entre 25-35 años'
  },
  {
    id: 'desiredFeatures',
    question: '¿Qué características deseas en tu sitio web?',
    type: 'multiselect',
    options: [
      { value: 'responsive', label: 'Diseño responsive' },
      { value: 'ecommerce', label: 'Tienda en línea' },
      { value: 'blog', label: 'Blog' },
      { value: 'contact', label: 'Formulario de contacto' },
      { value: 'gallery', label: 'Galería de imágenes' },
      { value: 'social', label: 'Integración con redes sociales' },
      { value: 'seo', label: 'Optimización para motores de búsqueda (SEO)' }
    ]
  },
  {
    id: 'contentManagement',
    question: '¿Cómo planeas gestionar el contenido de tu sitio?',
    type: 'select',
    options: [
      { value: 'cms', label: 'Sistema de gestión de contenidos (CMS)' },
      { value: 'static', label: 'Sitio web estático' },
      { value: 'developer', label: 'Actualización a través de un desarrollador' }
    ]
  },
  {
    id: 'designPreferences',
    question: '¿Tienes preferencias de diseño específicas?',
    type: 'text',
    placeholder: 'Ej.: Minimalista, Colorido, Profesional'
  },
  {
    id: 'competitorWebsites',
    question: '¿Puedes proporcionar ejemplos de sitios web de competidores o que te gusten?',
    type: 'text',
    placeholder: 'Ej.: www.ejemplo1.com, www.ejemplo2.com'
  },
  {
    id: 'budget',
    question: '¿Cuál es tu presupuesto aproximado para este proyecto?',
    type: 'select',
    options: [
      { value: 'low', label: 'Menos de $1,000' },
      { value: 'medium', label: '$1,000 - $5,000' },
      { value: 'high', label: 'Más de $5,000' }
    ]
  },
  {
    id: 'deadline',
    question: '¿Cuál es tu fecha límite para lanzar el sitio web?',
    type: 'text',
    placeholder: 'Ej.: En 3 meses, Para el 15 de diciembre'
  },
  {
    id: 'additionalComments',
    question: '¿Tienes algún comentario o requisito adicional?',
    type: 'textarea',
    placeholder: 'Escribe aquí cualquier información adicional...'
  }
]

export default function WebDevQuestionnaire() {
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (id: string, value: string | string[]) => {
    setFormData(prevData => ({ ...prevData, [id]: value }))
  }

  const handleNext = (e?: React.FormEvent) => {
    e?.preventDefault()
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrev = (e?: React.FormEvent) => {
    e?.preventDefault()
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (currentStep !== questions.length - 1) {
      handleNext()
      return
    }
    
    const requiredFields = ['businessName', 'industryType', 'websitePurpose', 'budget']
    const missingFields = requiredFields.filter(field => !formData[field as keyof FormData])
    
    if (missingFields.length > 0) {
      alert('Por favor complete todos los campos requeridos antes de enviar.')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Error al enviar el formulario')
      }

      alert('¡Gracias! Nos pondremos en contacto contigo pronto.')
      setFormData(initialFormData)
      setCurrentStep(0)
    } catch (error) {
      alert('Hubo un error al enviar el formulario. Por favor intente nuevamente.')
      console.error('Error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderInput = (question: any) => {
    switch (question.type) {
      case 'text':
        return (
          <input
            type="text"
            value={formData[question.id as keyof FormData] as string}
            onChange={(e) => handleChange(question.id, e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleNext(e)}
            placeholder={question.placeholder}
            className="w-full p-3 mt-2 text-white bg-gray-800 rounded-lg border border-[#87CEEB] focus:outline-none focus:ring-2 focus:ring-[#87CEEB] focus:border-transparent transition-all duration-300 hover:bg-gray-700 text-base sm:text-lg"
          />
        )
      case 'select':
        return (
          <select
            value={formData[question.id as keyof FormData] as string}
            onChange={(e) => handleChange(question.id, e.target.value)}
            className="w-full p-3 mt-2 text-white bg-gray-800 rounded-lg border border-[#87CEEB] focus:outline-none focus:ring-2 focus:ring-[#87CEEB] focus:border-transparent transition-all duration-300 hover:bg-gray-700 text-base sm:text-lg"
          >
            <option value="">Selecciona una opción</option>
            {question.options.map((option: any) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )
      case 'multiselect':
        return (
          <div className="mt-3 space-y-3 bg-gray-800 p-4 rounded-lg border border-[#87CEEB]">
            {question.options.map((option: any) => (
              <label key={option.value} className="flex items-center space-x-3 hover:bg-gray-700 p-2 rounded-md transition-colors duration-300">
                <input
                  type="checkbox"
                  checked={(formData[question.id as keyof FormData] as string[]).includes(option.value)}
                  onChange={(e) => {
                    const updatedFeatures = e.target.checked
                      ? [...(formData[question.id as keyof FormData] as string[]), option.value]
                      : (formData[question.id as keyof FormData] as string[]).filter((v) => v !== option.value)
                    handleChange(question.id, updatedFeatures)
                  }}
                  className="form-checkbox h-5 w-5 text-[#87CEEB] rounded border-[#87CEEB] focus:ring-[#87CEEB]"
                />
                <span className="text-white text-base sm:text-lg">{option.label}</span>
              </label>
            ))}
          </div>
        )
      case 'textarea':
        return (
          <textarea
            value={formData[question.id as keyof FormData] as string}
            onChange={(e) => handleChange(question.id, e.target.value)}
            placeholder={question.placeholder}
            className="w-full p-3 mt-2 text-white bg-gray-800 rounded-lg border border-[#87CEEB] focus:outline-none focus:ring-2 focus:ring-[#87CEEB] focus:border-transparent transition-all duration-300 hover:bg-gray-700 text-base sm:text-lg"
            rows={4}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-[#1a4a5e] to-gray-900 text-white p-4 sm:p-6 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-3xl"
      >
        <div className="flex justify-center mb-8">
          <Image
            src={Logo}
            alt="Tina Digital Logo"
            width={200}
            height={80}
            className="object-contain"
          />
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-center text-white">
          Cuestionario de Desarrollo Web
        </h1>
        <p className="text-center text-gray-300 mb-8 text-base sm:text-lg">
          ¡Bienvenido/a! Este cuestionario nos ayudará a entender mejor tus necesidades para crear la página web perfecta para tu negocio.
        </p>
        <form onSubmit={handleSubmit} className="relative" onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}>
          <div className="absolute top-2 right-2 text-sm text-gray-400 bg-gray-800/80 px-2 py-1 rounded-md font-medium z-10">
            {currentStep + 1}/{questions.length}
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
              className="bg-gray-800/90 backdrop-blur-lg p-6 sm:p-8 rounded-xl shadow-2xl border border-[#87CEEB]"
            >
              <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-6 text-white">{questions[currentStep].question}</h2>
              {renderInput(questions[currentStep])}
            </motion.div>
          </AnimatePresence>
          <div className="mt-8 flex flex-col sm:flex-row justify-between gap-4">
            <motion.button
              type="button"
              onClick={handlePrev}
              disabled={currentStep === 0 || isSubmitting}
              className={`px-6 py-3 rounded-lg flex-1 text-base sm:text-lg ${
                currentStep === 0 || isSubmitting
                  ? 'bg-gray-600 cursor-not-allowed opacity-50' 
                  : 'bg-gray-800 hover:bg-gray-700 text-white border border-[#87CEEB] shadow-lg hover:shadow-[#87CEEB]/30'
              } transition-all duration-300`}
              whileHover={{ scale: currentStep === 0 || isSubmitting ? 1 : 1.03 }}
              whileTap={{ scale: currentStep === 0 || isSubmitting ? 1 : 0.97 }}
            >
              Anterior
            </motion.button>
            <motion.button
              type="submit"
              disabled={isSubmitting}
              className={`px-6 py-3 rounded-lg flex-1 ${
                isSubmitting 
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-[#87CEEB] hover:bg-[#5f90a3]'
              } text-white shadow-lg hover:shadow-[#87CEEB]/30 transition-all duration-300 text-base sm:text-lg`}
              whileHover={{ scale: isSubmitting ? 1 : 1.03 }}
              whileTap={{ scale: isSubmitting ? 1 : 0.97 }}
            >
              {isSubmitting 
                ? 'Enviando...' 
                : currentStep === questions.length - 1 
                  ? 'Enviar' 
                  : 'Siguiente'
              }
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}
