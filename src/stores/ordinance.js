import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useOrdinanceStore = defineStore('ordinance', () => {
  // State
  const ordinances = ref([
    {
      id: 1,
      title: 'Business Permit Requirements',
      category: 'Business & Commerce',
      ordinanceNumber: 'Ordinance No. 2023-01',
      description: 'Requirements for obtaining business permits in Butuan City',
      content: `All businesses operating within Butuan City must secure a business permit. Requirements include:
      1. Duly accomplished application form
      2. Mayor's Permit from previous year (for renewal)
      3. Barangay Clearance
      4. Proof of business location ownership or lease agreement
      5. Sanitary Permit for food-related businesses
      6. Fire Safety Inspection Certificate
      7. Occupancy Permit for new establishments
      
      Processing time: 3-5 working days
      Fees: Based on business capitalization`,
      tags: ['business', 'permit', 'registration', 'compliance'],
      effectiveDate: '2023-01-15',
      status: 'active',
      views: 245,
      lastUpdated: '2024-01-15'
    },
    {
      id: 2,
      title: 'Traffic Rules and Regulations',
      category: 'Traffic & Transportation',
      ordinanceNumber: 'Ordinance No. 2023-05',
      description: 'Updated traffic rules and penalties for violations',
      content: `Traffic Rules in Butuan City:
      1. Speed Limits:
         - 30 kph within school zones
         - 40 kph in residential areas
         - 60 kph on main roads
      
      2. No Parking Zones:
         - Within 5 meters of intersections
         - In front of fire hydrants
         - Bus stops
         - Designated no parking areas
      
      3. Violations and Penalties:
         - Illegal parking: ₱500 fine
         - Over-speeding: ₱1,000 fine + seminar
         - No helmet (motorcycle): ₱300 fine
         - Driving without license: ₱2,000 fine`,
      tags: ['traffic', 'parking', 'violations', 'fines'],
      effectiveDate: '2023-03-01',
      status: 'active',
      views: 189,
      lastUpdated: '2024-02-10'
    },
    {
      id: 3,
      title: 'Environmental Protection Guidelines',
      category: 'Environment & Natural Resources',
      ordinanceNumber: 'Ordinance No. 2023-08',
      description: 'Guidelines for environmental protection and waste management',
      content: `Environmental Protection Regulations:
      1. Waste Segregation:
         - Mandatory segregation at source
         - Color-coded bins: Green (biodegradable), Blue (recyclable), Black (non-recyclable)
      
      2. Prohibited Acts:
         - Burning of waste materials
         - Dumping in rivers and waterways
         - Use of single-use plastics in government offices
      
      3. Business Requirements:
         - Environmental Compliance Certificate (ECC) for certain industries
         - Waste Management Plan for businesses
         - Regular environmental inspections`,
      tags: ['environment', 'waste', 'recycling', 'pollution'],
      effectiveDate: '2023-06-15',
      status: 'active',
      views: 156,
      lastUpdated: '2024-01-30'
    },
    {
      id: 4,
      title: 'Public Health Safety Measures',
      category: 'Public Health & Safety',
      ordinanceNumber: 'Ordinance No. 2023-12',
      description: 'Health and safety regulations for public establishments',
      content: `Public Health Requirements:
      1. Food Establishments:
         - Sanitary Permit required
         - Regular health check for food handlers
         - Proper waste disposal system
      
      2. Public Gatherings:
         - Permit required for events with 50+ people
         - Sanitation facilities must be provided
         - Emergency exits must be marked
      
      3. Construction Sites:
         - Safety signage required
         - Proper waste management
         - Noise control measures`,
      tags: ['health', 'safety', 'sanitation', 'public'],
      effectiveDate: '2023-09-01',
      status: 'active',
      views: 132,
      lastUpdated: '2024-02-15'
    },
    {
      id: 5,
      title: 'Property Development Guidelines',
      category: 'Land Use & Zoning',
      ordinanceNumber: 'Ordinance No. 2023-15',
      description: 'Guidelines for property development and land use',
      content: `Property Development Regulations:
      1. Zoning Classifications:
         - Residential (R-1, R-2, R-3)
         - Commercial (C-1, C-2, C-3)
         - Industrial (I-1, I-2)
         - Agricultural
      
      2. Building Requirements:
         - Building Permit required for construction
         - Certificate of Occupancy before use
         - Fire safety clearance
      
      3. Setback Requirements:
         - Front: 3 meters
         - Sides: 2 meters
         - Rear: 3 meters`,
      tags: ['property', 'zoning', 'construction', 'building'],
      effectiveDate: '2023-11-01',
      status: 'active',
      views: 98,
      lastUpdated: '2024-01-20'
    }
  ])

  const categories = ref([
    'Public Health & Safety',
    'Land Use & Zoning', 
    'Environment & Natural Resources',
    'Business & Commerce',
    'Traffic & Transportation',
    'Community & Social Services',
    'Criminal Law',
    'Family Law',
    'Employment Law',
    'Real Estate Law'
  ])

  // Getters
  const activeOrdinances = computed(() => {
    return ordinances.value.filter(ord => ord.status === 'active')
  })

  const draftOrdinances = computed(() => {
    return ordinances.value.filter(ord => ord.status === 'draft')
  })

  const ordinanceCountByCategory = computed(() => {
    const counts = {}
    categories.value.forEach(category => {
      counts[category] = ordinances.value.filter(ord => ord.category === category).length
    })
    return counts
  })

  const popularOrdinances = computed(() => {
    return [...ordinances.value]
      .sort((a, b) => b.views - a.views)
      .slice(0, 5)
  })

  const recentOrdinances = computed(() => {
    return [...ordinances.value]
      .sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated))
      .slice(0, 5)
  })

  // Actions
  const addOrdinance = (ordinanceData) => {
    const newOrdinance = {
      id: Date.now(),
      ...ordinanceData,
      views: 0,
      status: 'draft',
      lastUpdated: new Date().toISOString().split('T')[0]
    }
    
    ordinances.value.unshift(newOrdinance)
    return newOrdinance
  }

  const updateOrdinance = (ordinanceId, updates) => {
    const index = ordinances.value.findIndex(ord => ord.id === ordinanceId)
    if (index !== -1) {
      ordinances.value[index] = {
        ...ordinances.value[index],
        ...updates,
        lastUpdated: new Date().toISOString().split('T')[0]
      }
    }
  }

  const deleteOrdinance = (ordinanceId) => {
    const index = ordinances.value.findIndex(ord => ord.id === ordinanceId)
    if (index !== -1) {
      ordinances.value.splice(index, 1)
    }
  }

  const publishOrdinance = (ordinanceId) => {
    const ordinance = ordinances.value.find(ord => ord.id === ordinanceId)
    if (ordinance) {
      ordinance.status = 'active'
      ordinance.lastUpdated = new Date().toISOString().split('T')[0]
    }
  }

  const archiveOrdinance = (ordinanceId) => {
    const ordinance = ordinances.value.find(ord => ord.id === ordinanceId)
    if (ordinance) {
      ordinance.status = 'archived'
      ordinance.lastUpdated = new Date().toISOString().split('T')[0]
    }
  }

  const incrementViews = (ordinanceId) => {
    const ordinance = ordinances.value.find(ord => ord.id === ordinanceId)
    if (ordinance) {
      ordinance.views += 1
    }
  }

  const searchOrdinances = (query) => {
    const searchTerm = query.toLowerCase()
    return ordinances.value.filter(ord => 
      ord.title.toLowerCase().includes(searchTerm) ||
      ord.description.toLowerCase().includes(searchTerm) ||
      ord.content.toLowerCase().includes(searchTerm) ||
      ord.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
      ord.ordinanceNumber.toLowerCase().includes(searchTerm)
    )
  }

  const getOrdinancesByCategory = (category) => {
    return ordinances.value.filter(ord => ord.category === category && ord.status === 'active')
  }

  const getOrdinance = (ordinanceId) => {
    const ordinance = ordinances.value.find(ord => ord.id === ordinanceId)
    if (ordinance) {
      incrementViews(ordinanceId)
    }
    return ordinance
  }

  const addCategory = (categoryName) => {
    if (!categories.value.includes(categoryName)) {
      categories.value.push(categoryName)
    }
  }

  return {
    // State
    ordinances,
    categories,
    
    // Getters
    activeOrdinances,
    draftOrdinances,
    ordinanceCountByCategory,
    popularOrdinances,
    recentOrdinances,
    
    // Actions
    addOrdinance,
    updateOrdinance,
    deleteOrdinance,
    publishOrdinance,
    archiveOrdinance,
    incrementViews,
    searchOrdinances,
    getOrdinancesByCategory,
    getOrdinance,
    addCategory
  }
})