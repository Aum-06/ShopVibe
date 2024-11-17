import React from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

const CategoryItem = ({ category }) => {
  return (
    <div className='h-96 w-full relative overflow-hidden rounded-lg group'>
      <Link to={"/category" + category.href} className="block h-full">
        <div className="relative h-full w-full cursor-pointer overflow-hidden">
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/20 to-gray-900/90 z-20 transition-opacity duration-300 group-hover:opacity-90" />
          
          {/* Image */}
          <img 
            src={category.imageUrl} 
            alt={category.name} 
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110" 
            loading='lazy'
          />

          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 p-6 z-30 transform transition-transform duration-300 group-hover:translate-y-[-8px]">
            <h3 className='text-2xl font-bold text-white mb-2 drop-shadow-lg'>
              {category.name}
            </h3>
            <p className='text-gray-200 font-medium drop-shadow-md transition-opacity duration-300 opacity-80 group-hover:opacity-100'>
              Explore our {category.name.toLowerCase()} collection
            </p>
            
            {/* Call to action */}
            <div className="mt-4 inline-flex items-center text-white opacity-0 transform translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
              <span className="text-sm font-semibold">Shop Now</span>
              <ChevronRight className="w-5 h-5 ml-2" />
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}

export default CategoryItem