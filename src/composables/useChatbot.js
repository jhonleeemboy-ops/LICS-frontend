// src/composables/useChatbot.js
import { ref } from 'vue'

export const useChatbot = () => {
  const isProcessing = ref(false)

  // Complete Ordinance database for Butuan City
  const ordinanceDatabase = {
    business: {
      title: 'Ordinance No. 2023-01: Business Permit and Licensing Code',
      year: '2023',
      summary: 'Comprehensive guidelines for business registration and operation in Butuan City',
      requirements: [
        'DTI/SEC Registration Certificate',
        'Barangay Clearance from business location',
        'Mayor\'s Permit Application Form',
        'Fire Safety Inspection Certificate',
        'Sanitary Permit from City Health Office',
        'Location Clearance',
        'Community Tax Certificate (Cedula)'
      ],
      fees: 'Based on gross sales: ₱5,000 - ₱50,000',
      processingTime: '3-5 business days'
    },
    property: {
      title: 'Ordinance No. 2022-15: Real Property Tax Code',
      year: '2022',
      summary: 'Tax rates and regulations for real property in Butuan City',
      rates: {
        residential: '1% of assessed value',
        commercial: '2% of assessed value',
        industrial: '2% of assessed value',
        agricultural: '0.5% of assessed value'
      },
      discounts: 'Early payment (Jan-Mar): 10% discount',
      penalties: 'Late payment: 2% per month'
    },
    traffic: {
      title: 'Ordinance No. 2021-08: Traffic Management Code',
      year: '2021',
      summary: 'Traffic rules, violations, and penalties within Butuan City',
      violations: {
        'Illegal Parking': '₱500 - ₱1,000',
        'No Helmet': '₱1,500',
        'Expired Registration': '₱10,000',
        'Reckless Driving': '₱2,000 - ₱5,000',
        'Disregarding Traffic Signs': '₱1,000',
        'Illegal Overtaking': '₱1,500',
        'Triple Riding': '₱1,000',
        'No License': '₱3,000',
        'Driving Under Influence': '₱5,000 - ₱10,000'
      }
    },
    environment: {
      title: 'Ordinance No. 2020-12: Solid Waste Management Code',
      year: '2020',
      summary: 'Waste segregation and environmental protection regulations',
      segregation: {
        biodegradable: 'Food waste, garden waste (Green bin)',
        nonBiodegradable: 'Plastic, styrofoam (Black bin)',
        recyclable: 'Paper, metal, glass (Blue bin)',
        special: 'Medical waste, batteries (Red bin)'
      },
      schedule: {
        biodegradable: 'Monday, Wednesday, Friday',
        nonBiodegradable: 'Tuesday, Thursday',
        recyclable: 'Saturday'
      },
      penalties: '1st: Warning, 2nd: ₱500, 3rd: ₱1,000 + community service'
    },
    health: {
      title: 'Ordinance No. 2019-05: Anti-Smoking Ordinance',
      year: '2019',
      summary: 'Prohibition of smoking in public places',
      prohibited: [
        'All enclosed public spaces',
        'Within 100 meters of schools',
        'Public transportation',
        'Government offices',
        'Hospitals and health facilities',
        'Restaurants and food establishments'
      ],
      penalties: '₱500 - ₱5,000 depending on offense',
      designatedAreas: 'Only in open-air designated smoking areas'
    },
    building: {
      title: 'Ordinance No. 2022-09: Building Code',
      year: '2022',
      summary: 'Construction and building permit regulations',
      requirements: [
        'Lot plan and location map',
        'Architectural plans (licensed architect)',
        'Structural plans (licensed engineer)',
        'Electrical and plumbing plans',
        'Bill of materials and cost estimates',
        'Tax declaration of property',
        'Certificate of land title'
      ],
      processingTime: '20-30 working days',
      inspections: ['Foundation', 'Framework', 'Final']
    }
  }

  // AI-powered query analysis
  const analyzeQuery = (query) => {
    const lowerQuery = query.toLowerCase()
    
    // Define keywords for each category
    const keywords = {
      business: ['business', 'permit', 'register', 'license', 'company', 'store', 'shop', 'enterprise', 'dti', 'sec', 'mayor', 'establishment'],
      property: ['property', 'land', 'tax', 'real estate', 'lot', 'house', 'building', 'assessment', 'payment', 'title', 'deed'],
      traffic: ['traffic', 'parking', 'vehicle', 'violation', 'car', 'motorcycle', 'driver', 'license', 'ticket', 'penalty', 'helmet'],
      environment: ['environment', 'waste', 'garbage', 'trash', 'pollution', 'segregation', 'recycle', 'disposal', 'dump', 'clean'],
      health: ['health', 'sanitary', 'smoking', 'hygiene', 'covid', 'pandemic', 'certificate', 'medical', 'smoke', 'cigarette'],
      building: ['building', 'construction', 'renovation', 'architect', 'engineer', 'structure', 'build', 'construct', 'renovate']
    }

    // Score each category based on keyword matches
    const scores = {}
    for (const [category, words] of Object.entries(keywords)) {
      scores[category] = words.filter(word => lowerQuery.includes(word)).length
    }

    // Get highest scoring category
    const topCategory = Object.entries(scores).reduce((a, b) => b[1] > a[1] ? b : a)[0]
    const hasMatch = scores[topCategory] > 0

    if (!hasMatch) {
      return generateGeneralResponse()
    }

    // Generate response based on category
    switch (topCategory) {
      case 'business':
        return generateBusinessResponse(lowerQuery)
      case 'property':
        return generatePropertyResponse(lowerQuery)
      case 'traffic':
        return generateTrafficResponse(lowerQuery)
      case 'environment':
        return generateEnvironmentResponse(lowerQuery)
      case 'health':
        return generateHealthResponse(lowerQuery)
      case 'building':
        return generateBuildingResponse(lowerQuery)
      default:
        return generateGeneralResponse()
    }
  }

  const generateBusinessResponse = (query) => {
    const data = ordinanceDatabase.business
    let response = `**Business Registration in Butuan City**\n\n`

    if (query.includes('requirement') || query.includes('need') || query.includes('document')) {
      response += `📋 **Required Documents:**\n`
      data.requirements.forEach((req, i) => {
        response += `${i + 1}. ${req}\n`
      })
      response += `\n💰 **Fees:** ${data.fees}\n`
      response += `⏱️ **Processing Time:** ${data.processingTime}\n\n`
      response += `**Where to Apply:**\nBusiness Permits and Licensing Office\nButuan City Hall, Ground Floor\nMonday to Friday, 8:00 AM - 5:00 PM\n`
    } else if (query.includes('how much') || query.includes('cost') || query.includes('fee')) {
      response += `💰 **Business Permit Fees:**\n${data.fees}\n\n`
      response += `The exact amount depends on:\n`
      response += `- Type of business (retail, service, manufacturing)\n`
      response += `- Gross sales/receipts per year\n`
      response += `- Business location (commercial or residential zone)\n`
      response += `- Number of employees\n\n`
      response += `For exact computation, visit the Business Permits Office with your business details.`
    } else if (query.includes('how long') || query.includes('processing') || query.includes('time')) {
      response += `⏱️ **Processing Time:** ${data.processingTime}\n\n`
      response += `**To expedite your application:**\n`
      response += `1. Complete all requirements before applying\n`
      response += `2. Ensure all documents are notarized if needed\n`
      response += `3. Apply early in the morning (8:00 AM)\n`
      response += `4. Bring photocopies and original documents\n`
    } else if (query.includes('renew')) {
      response += `**Business Permit Renewal:**\n\n`
      response += `Renew your permit annually before January 20.\n\n`
      response += `**Requirements for Renewal:**\n`
      response += `1. Previous year's Business Permit\n`
      response += `2. Official Receipt of previous payment\n`
      response += `3. Community Tax Certificate (Cedula)\n`
      response += `4. Updated Sanitary Permit\n`
      response += `5. Updated Fire Safety Certificate\n\n`
      response += `**Early renewal discount:** 10% if paid before January 31`
    } else {
      response += `Here's what you need to know:\n\n`
      response += `📋 **Requirements:** ${data.requirements.length} documents needed\n`
      response += `💰 **Fees:** ${data.fees}\n`
      response += `⏱️ **Processing:** ${data.processingTime}\n\n`
      response += `**Application Process:**\n`
      response += `1. Secure DTI/SEC Registration\n`
      response += `2. Get Barangay Clearance\n`
      response += `3. Apply at City Hall Business Permits Office\n`
      response += `4. Pay fees at City Treasurer's Office\n`
      response += `5. Claim your Business Permit\n`
    }

    response += `\n\n📚 **Reference:** ${data.title}`

    return {
      text: response,
      category: 'Business & Commerce',
      ordinances: [data.title],
      suggestions: [
        'What documents do I need?',
        'How much are the fees?',
        'How to renew my permit?'
      ]
    }
  }

  const generatePropertyResponse = (query) => {
    const data = ordinanceDatabase.property
    let response = `**Property Tax Information - Butuan City**\n\n`

    if (query.includes('rate') || query.includes('how much') || query.includes('calculate')) {
      response += `📊 **Tax Rates:**\n`
      response += `- Residential: ${data.rates.residential}\n`
      response += `- Commercial: ${data.rates.commercial}\n`
      response += `- Industrial: ${data.rates.industrial}\n`
      response += `- Agricultural: ${data.rates.agricultural}\n\n`
      response += `**Example Calculation:**\n`
      response += `If your property's assessed value is ₱500,000:\n`
      response += `Residential tax = ₱500,000 × 1% = ₱5,000/year\n`
      response += `Commercial tax = ₱500,000 × 2% = ₱10,000/year\n\n`
      response += `**Assessment Value** = Market Value × Assessment Level (typically 20-50%)`
    } else if (query.includes('discount') || query.includes('early') || query.includes('when')) {
      response += `💵 **Payment Schedule & Benefits:**\n`
      response += `${data.discounts}\n\n`
      response += `**Payment Periods:**\n`
      response += `- January 1 - March 31: Full payment with 10% discount\n`
      response += `- Quarterly: March 31, June 30, Sept 30, Dec 31\n`
      response += `- Monthly: Allowed but no discount\n\n`
      response += `⚠️ **Late Payment Penalty:** ${data.penalties}`
    } else if (query.includes('where') || query.includes('pay')) {
      response += `**Where to Pay Property Tax:**\n\n`
      response += `**City Treasurer's Office**\n`
      response += `Butuan City Hall, 2nd Floor\n`
      response += `Monday to Friday: 8:00 AM - 5:00 PM\n\n`
      response += `**Authorized Payment Centers:**\n`
      response += `- LandBank of the Philippines\n`
      response += `- Development Bank of the Philippines\n`
      response += `- Selected pawnshops and payment centers\n\n`
      response += `**Required Documents:**\n`
      response += `1. Tax Declaration\n`
      response += `2. Official Receipt (previous payment)\n`
      response += `3. Valid ID\n`
    } else {
      response += `**Tax Rates:**\n`
      for (const [type, rate] of Object.entries(data.rates)) {
        response += `- ${type.charAt(0).toUpperCase() + type.slice(1)}: ${rate}\n`
      }
      response += `\n💰 **Discounts:** ${data.discounts}\n`
      response += `⚠️ **Penalties:** ${data.penalties}\n\n`
      response += `Pay at City Treasurer's Office or authorized payment centers.`
    }

    response += `\n\n📚 **Reference:** ${data.title}`

    return {
      text: response,
      category: 'Land Use & Zoning',
      ordinances: [data.title],
      suggestions: [
        'How are rates calculated?',
        'When is the deadline?',
        'Where can I pay?'
      ]
    }
  }

  const generateTrafficResponse = (query) => {
    const data = ordinanceDatabase.traffic
    let response = `**Traffic Regulations - Butuan City**\n\n`

    if (query.includes('violation') || query.includes('penalty') || query.includes('fine')) {
      response += `🚗 **Common Violations & Penalties:**\n\n`
      for (const [violation, penalty] of Object.entries(data.violations)) {
        response += `**${violation}:** ${penalty}\n`
      }
      response += `\n**Important Notes:**\n`
      response += `- Penalties increase for repeat offenses\n`
      response += `- Vehicle may be impounded for serious violations\n`
      response += `- Driver's license may be suspended\n\n`
      response += `**To Contest a Violation:**\n`
      response += `1. Visit City Traffic Management Office within 15 days\n`
      response += `2. Present citation ticket and evidence\n`
      response += `3. File a written explanation\n`
      response += `4. Attend scheduled hearing if required\n`
    } else if (query.includes('parking')) {
      response += `🅿️ **Parking Regulations:**\n\n`
      response += `**Prohibited Areas:**\n`
      response += `- Within 5 meters of intersections\n`
      response += `- In front of fire hydrants\n`
      response += `- On sidewalks and pedestrian lanes\n`
      response += `- Yellow curb zones\n`
      response += `- Within 10 meters of crosswalks\n`
      response += `- Loading and unloading zones (except when actively loading)\n\n`
      response += `**Time Limits:**\n`
      response += `- Commercial areas: 1-hour limit unless posted\n`
      response += `- Residential areas: No overnight parking by non-residents\n\n`
      response += `**Penalty:** ${data.violations['Illegal Parking']}\n`
      response += `**Additional:** Vehicle may be towed at owner's expense`
    } else if (query.includes('license')) {
      response += `**Driver's License Requirements:**\n\n`
      response += `For license-related concerns, visit:\n`
      response += `**LTO Butuan District Office**\n`
      response += `J.C. Aquino Avenue, Butuan City\n\n`
      response += `**Driving Without License:**\n`
      response += `Penalty: ${data.violations['No License']}\n`
      response += `Vehicle will be impounded\n\n`
      response += `**Student Permit Required:**\n`
      response += `- Must be at least 17 years old\n`
      response += `- Pass written examination\n`
      response += `- Complete driving course\n`
    } else {
      response += `**Key Traffic Rules:**\n\n`
      response += `**Most Common Violations:**\n`
      response += `- No Helmet: ${data.violations['No Helmet']}\n`
      response += `- Reckless Driving: ${data.violations['Reckless Driving']}\n`
      response += `- Illegal Parking: ${data.violations['Illegal Parking']}\n`
      response += `- No License: ${data.violations['No License']}\n\n`
      response += `**Traffic Management Office:**\n`
      response += `📞 Hotline: (085) 225-XXXX\n`
      response += `📍 Location: City Hall Compound\n`
      response += `⏰ Hours: Monday-Friday, 8:00 AM - 5:00 PM`
    }

    response += `\n\n📚 **Reference:** ${data.title}`

    return {
      text: response,
      category: 'Traffic & Transportation',
      ordinances: [data.title],
      suggestions: [
        'What are parking rules?',
        'License requirements?',
        'How to contest a ticket?'
      ]
    }
  }

  const generateEnvironmentResponse = (query) => {
    const data = ordinanceDatabase.environment
    let response = `**Environmental Regulations - Butuan City**\n\n`

    if (query.includes('segregat') || query.includes('separate') || query.includes('sort')) {
      response += `♻️ **Waste Segregation (MANDATORY):**\n\n`
      for (const [type, desc] of Object.entries(data.segregation)) {
        response += `**${type.charAt(0).toUpperCase() + type.slice(1)}:** ${desc}\n`
      }
      response += `\n📅 **Collection Schedule:**\n`
      for (const [type, schedule] of Object.entries(data.schedule)) {
        response += `- ${type.charAt(0).toUpperCase() + type.slice(1)}: ${schedule}\n`
      }
      response += `\n**Important:**\n`
      response += `- Waste must be in proper colored bins\n`
      response += `- Place waste outside before 6:00 AM on collection day\n`
      response += `- Unsegregated waste will NOT be collected\n`
    } else if (query.includes('penalty') || query.includes('fine') || query.includes('violation')) {
      response += `⚠️ **Penalties for Non-Compliance:**\n`
      response += data.penalties + `\n\n`
      response += `**Additional Sanctions:**\n`
      response += `- Suspension of garbage collection service\n`
      response += `- 8 hours of community service\n`
      response += `- Legal action for repeated violations\n`
      response += `- Fine increases by ₱500 per violation\n\n`
      response += `**Violations Include:**\n`
      response += `- Improper waste segregation\n`
      response += `- Littering in public places\n`
      response += `- Burning of garbage\n`
      response += `- Dumping in unauthorized areas\n`
    } else if (query.includes('schedule') || query.includes('collection')) {
      response += `📅 **Garbage Collection Schedule:**\n\n`
      for (const [type, schedule] of Object.entries(data.schedule)) {
        response += `**${type.charAt(0).toUpperCase() + type.slice(1)}:**\n${schedule}\n\n`
      }
      response += `**Collection Time:** 6:00 AM - 12:00 PM\n\n`
      response += `**Special Reminders:**\n`
      response += `- Place waste bins outside before 6:00 AM\n`
      response += `- Do not place waste on non-collection days\n`
      response += `- Keep bins on your property at other times\n`
    } else {
      response += `**Quick Guide:**\n\n`
      response += `🟢 **Green Bin:** Biodegradable (food, garden waste)\n`
      response += `⚫ **Black Bin:** Non-biodegradable (plastic, styrofoam)\n`
      response += `🔵 **Blue Bin:** Recyclable (paper, metal, glass)\n`
      response += `🔴 **Red Bin:** Special waste (medical, batteries)\n\n`
      response += `**To Report Violations:**\n`
      response += `📞 City Environment Office: (085) 225-XXXX\n`
      response += `📧 environment@butuan.gov.ph\n`
      response += `📍 City Hall, 3rd Floor\n\n`
      response += `**Hazardous Waste Disposal:**\n`
      response += `Bring to designated collection points every first Saturday of the month.`
    }

    response += `\n\n📚 **Reference:** ${data.title}`

    return {
      text: response,
      category: 'Environment & Natural Resources',
      ordinances: [data.title],
      suggestions: [
        'Waste segregation rules?',
        'Collection schedule?',
        'How to report violations?'
      ]
    }
  }

  const generateHealthResponse = (query) => {
    const data = ordinanceDatabase.health
    let response = `**Public Health Regulations - Butuan City**\n\n`

    if (query.includes('smoking') || query.includes('smoke') || query.includes('cigarette')) {
      response += `🚭 **Anti-Smoking Ordinance:**\n\n`
      response += `**Prohibited Areas:**\n`
      data.prohibited.forEach(area => {
        response += `- ${area}\n`
      })
      response += `\n**Allowed:** ${data.designatedAreas}\n\n`
      response += `**Penalties:**\n`
      response += `- 1st Offense: ${data.penalties}\n`
      response += `- 2nd Offense: Double the fine\n`
      response += `- 3rd Offense: Maximum penalty + community service\n\n`
      response += `**For Establishment Owners:**\n`
      response += `- Must post "No Smoking" signs\n`
      response += `- Provide designated smoking areas (outdoor only)\n`
      response += `- Penalties for non-compliance: ₱5,000 - ₱20,000\n`
    } else if (query.includes('sanitary') || query.includes('permit')) {
      response += `🏥 **Sanitary Permit Requirements:**\n\n`
      response += `**Required For:**\n`
      response += `- Food establishments (restaurants, carinderias)\n`
      response += `- Barber shops and beauty salons\n`
      response += `- Hotels and lodging houses\n`
      response += `- Public markets and stalls\n`
      response += `- Fitness centers and gyms\n`
      response += `- Day care centers\n\n`
      response += `**Requirements:**\n`
      response += `1. Health certificates for all staff (₱50/person)\n`
      response += `2. Facility inspection by health officer\n`
      response += `3. Compliance with health standards\n`
      response += `4. Proof of potable water source\n`
      response += `5. Proper waste disposal system\n\n`
      response += `**Validity:** 1 year (annual renewal required)\n`
      response += `**Fee:** ₱500 - ₱2,000 (depends on establishment type)\n\n`
      response += `Visit City Health Office for application.`
    } else if (query.includes('certificate') || query.includes('health card')) {
      response += `**Health Certificate Application:**\n\n`
      response += `**Who Needs It:**\n`
      response += `- Food handlers\n`
      response += `- Service industry workers\n`
      response += `- Anyone applying for sanitary permit\n\n`
      response += `**Requirements:**\n`
      response += `1. Valid ID\n`
      response += `2. 1x1 ID picture (2 pcs)\n`
      response += `3. Medical examination results\n\n`
      response += `**Process:**\n`
      response += `1. Get medical examination at City Health Office\n`
      response += `2. Submit requirements\n`
      response += `3. Pay fee (FREE for Butuan residents)\n`
      response += `4. Claim certificate after 3 days\n\n`
      response += `**Validity:** 1 year\n\n`
      response += `**City Health Office Hours:**\n`
      response += `Monday to Friday: 8:00 AM - 5:00 PM`
    } else {
      response += `**Key Regulations:**\n\n`
      response += `🚭 **Smoking** prohibited in all enclosed public places\n`
      response += `🏥 **Sanitary permits** required for food/service businesses\n`
      response += `💉 **Health certificates** free for residents\n\n`
      response += `**City Health Office Services:**\n`
      response += `- Health certificate issuance\n`
      response += `- Sanitary inspections\n`
      response += `- Immunization programs\n`
      response += `- Health education\n`
      response += `- Dental services\n\n`
      response += `**Contact Information:**\n`
      response += `📞 (085) 225-XXXX\n`
      response += `📍 City Hall, 2nd Floor\n`
      response += `⏰ Mon-Fri: 8:00 AM - 5:00 PM`
    }

    response += `\n\n📚 **Reference:** ${data.title}`

    return {
      text: response,
      category: 'Public Health & Safety',
      ordinances: [data.title],
      suggestions: [
        'Where can I smoke?',
        'Sanitary permit requirements?',
        'How to get health certificate?'
      ]
    }
  }

  const generateBuildingResponse = (query) => {
    const data = ordinanceDatabase.building
    let response = `**Building & Construction - Butuan City**\n\n`

    if (query.includes('requirement') || query.includes('need') || query.includes('document')) {
      response += `📋 **Building Permit Requirements:**\n\n`
      data.requirements.forEach((req, i) => {
        response += `${i + 1}. ${req}\n`
      })
      response += `\n⏱️ **Processing Time:** ${data.processingTime}\n\n`
      response += `**Additional Requirements:**\n`
      response += `- Notarized Affidavit of Undertaking\n`
      response += `- Vicinity map\n`
      response += `- As-built plans (for renovations)\n`
      response += `- Environmental Compliance Certificate (for large projects)\n`
    } else if (query.includes('inspection')) {
      response += `🔍 **Required Inspections:**\n\n`
      data.inspections.forEach((inspection, i) => {
        response += `**${i + 1}. ${inspection} Inspection**\n`
      })
      response += `\n**Inspection Process:**\n`
      response += `1. Schedule inspection with City Engineer's Office\n`
      response += `2. Inspector visits the site\n`
      response += `3. Receive inspection report\n`
      response += `4. Address any violations or issues\n`
      response += `5. Proceed to next construction phase\n\n`
      response += `**Important:** Do not proceed to next phase without inspection clearance.\n\n`
      response += `**Final Inspection:** Required before Certificate of Occupancy is issued.`
    } else if (query.includes('fee') || query.includes('cost') || query.includes('how much')) {
      response += `**Building Permit Fees:**\n\n`
      response += `Fees are computed based on:\n`
      response += `1. **Total Floor Area** (square meters)\n`
      response += `2. **Project Cost** (from bill of materials)\n`
      response += `3. **Type of Construction:**\n`
      response += `   - Residential: Lower rate\n`
      response += `   - Commercial: Higher rate\n`
      response += `   - Industrial: Highest rate\n\n`
      response += `**Typical Fee Range:**\n`
      response += `- Small residential (50-100 sqm): ₱5,000 - ₱15,000\n`
      response += `- Medium residential (101-200 sqm): ₱15,000 - ₱30,000\n`
      response += `- Large/Commercial: ₱30,000 and above\n\n`
      response += `For exact computation, bring your plans to City Engineer's Office.`
    } else if (query.includes('violation') || query.includes('illegal')) {
      response += `**Building Without Permit:**\n\n`
      response += `⚠️ **Consequences:**\n`
      response += `- Stop work order issued immediately\n`
      response += `- Fines and penalties (up to 3x regular permit fee)\n`
      response += `- Demolition order for serious violations\n`
      response += `- Legal action possible\n\n`
      response += `**To Regularize:**\n`
      response += `1. Stop all construction work\n`
      response += `2. Apply for building permit\n`
      response += `3. Pay penalties\n`
      response += `4. Pass all required inspections\n\n`
      response += `Always secure permits BEFORE starting construction!`
    } else {
      response += `**Building Permit Process:**\n\n`
      response += `📋 **Documents:** ${data.requirements.length} requirements\n`
      response += `⏱️ **Processing:** ${data.processingTime}\n`
      response += `🔍 **Inspections:** ${data.inspections.join(', ')}\n\n`
      response += `**Step-by-Step Process:**\n`
      response += `1. Prepare all required documents\n`
      response += `2. Submit to City Engineer's Office\n`
      response += `3. Wait for evaluation (20-30 days)\n`
      response += `4. Pay fees at City Treasurer's Office\n`
      response += `5. Claim Building Permit\n`
      response += `6. Post permit at construction site\n`
      response += `7. Schedule inspections as needed\n\n`
      response += `**Important Notes:**\n`
      response += `- Plans must be signed by licensed professionals\n`
      response += `- Occupancy permit required after completion\n`
      response += `- Permit valid for 1 year only\n\n`
      response += `Apply at City Engineer's Office, Butuan City Hall.`
    }

    response += `\n\n📚 **Reference:** ${data.title}`

    return {
      text: response,
      category: 'Land Use & Zoning',
      ordinances: [data.title],
      suggestions: [
        'What documents needed?',
        'Inspection requirements?',
        'How much are the fees?'
      ]
    }
  }

  const generateGeneralResponse = () => {
    return {
      text: `Hello! I'm your Butuan City Legal Assistant. I can help you with information about:\n\n💼 **Business & Commerce**\n- Business permits and licenses\n- Registration requirements\n- Operating regulations\n- Renewal procedures\n\n🏘️ **Property & Land**\n- Property tax rates and payment\n- Land use regulations\n- Title and documentation\n\n🚗 **Traffic & Transportation**\n- Traffic violations and penalties\n- Parking regulations\n- Driver's license information\n\n🌿 **Environment**\n- Waste segregation rules\n- Collection schedules\n- Environmental protection\n- Violation reporting\n\n🏥 **Public Health**\n- Sanitary permits\n- Anti-smoking ordinances\n- Health certificates\n\n🏗️ **Building & Construction**\n- Building permits\n- Construction requirements\n- Inspection procedures\n\nPlease ask me a specific question like:\n"How do I apply for a business permit?"\n"What are the property tax rates?"\n"What are traffic violation penalties?"\n"How to get a health certificate?"`,
      category: 'General',
      ordinances: [],
      suggestions: [
        'Business permit requirements?',
        'Property tax rates?',
        'Traffic violations?',
        'Waste management rules?'
      ]
    }
  }

  // Main chat processing function
  const processMessage = async (message) => {
    isProcessing.value = true

    // Simulate processing delay for realistic feel
    await new Promise(resolve => setTimeout(resolve, 1000))

    const response = analyzeQuery(message)
    isProcessing.value = false

    return response
  }

  return {
    isProcessing,
    processMessage,
    analyzeQuery,
    ordinanceDatabase
  }
}