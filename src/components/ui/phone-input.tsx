"use client"

import * as React from "react"
import { ChevronDown, Search } from "lucide-react"
import { cn } from "@/lib/utils"

interface Country {
  code: string
  name: string
  dialCode: string
}

// Function to convert country code to flag emoji
const getFlagEmoji = (countryCode: string): string => {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0))
  return String.fromCodePoint(...codePoints)
}

// Comprehensive list of countries with dial codes
const getAllCountries = (): Country[] => {
  return [
    { code: "AF", name: "Afghanistan", dialCode: "+93" },
    { code: "AL", name: "Albania", dialCode: "+355" },
    { code: "DZ", name: "Algeria", dialCode: "+213" },
    { code: "AD", name: "Andorra", dialCode: "+376" },
    { code: "AO", name: "Angola", dialCode: "+244" },
    { code: "AR", name: "Argentina", dialCode: "+54" },
    { code: "AM", name: "Armenia", dialCode: "+374" },
    { code: "AU", name: "Australia", dialCode: "+61" },
    { code: "AT", name: "Austria", dialCode: "+43" },
    { code: "AZ", name: "Azerbaijan", dialCode: "+994" },
    { code: "BH", name: "Bahrain", dialCode: "+973" },
    { code: "BD", name: "Bangladesh", dialCode: "+880" },
    { code: "BY", name: "Belarus", dialCode: "+375" },
    { code: "BE", name: "Belgium", dialCode: "+32" },
    { code: "BZ", name: "Belize", dialCode: "+501" },
    { code: "BJ", name: "Benin", dialCode: "+229" },
    { code: "BT", name: "Bhutan", dialCode: "+975" },
    { code: "BO", name: "Bolivia", dialCode: "+591" },
    { code: "BA", name: "Bosnia and Herzegovina", dialCode: "+387" },
    { code: "BW", name: "Botswana", dialCode: "+267" },
    { code: "BR", name: "Brazil", dialCode: "+55" },
    { code: "BN", name: "Brunei", dialCode: "+673" },
    { code: "BG", name: "Bulgaria", dialCode: "+359" },
    { code: "BF", name: "Burkina Faso", dialCode: "+226" },
    { code: "BI", name: "Burundi", dialCode: "+257" },
    { code: "KH", name: "Cambodia", dialCode: "+855" },
    { code: "CM", name: "Cameroon", dialCode: "+237" },
    { code: "CA", name: "Canada", dialCode: "+1" },
    { code: "CV", name: "Cape Verde", dialCode: "+238" },
    { code: "CF", name: "Central African Republic", dialCode: "+236" },
    { code: "TD", name: "Chad", dialCode: "+235" },
    { code: "CL", name: "Chile", dialCode: "+56" },
    { code: "CN", name: "China", dialCode: "+86" },
    { code: "CO", name: "Colombia", dialCode: "+57" },
    { code: "KM", name: "Comoros", dialCode: "+269" },
    { code: "CG", name: "Congo", dialCode: "+242" },
    { code: "CR", name: "Costa Rica", dialCode: "+506" },
    { code: "HR", name: "Croatia", dialCode: "+385" },
    { code: "CU", name: "Cuba", dialCode: "+53" },
    { code: "CY", name: "Cyprus", dialCode: "+357" },
    { code: "CZ", name: "Czech Republic", dialCode: "+420" },
    { code: "DK", name: "Denmark", dialCode: "+45" },
    { code: "DJ", name: "Djibouti", dialCode: "+253" },
    { code: "DO", name: "Dominican Republic", dialCode: "+1-809" },
    { code: "EC", name: "Ecuador", dialCode: "+593" },
    { code: "EG", name: "Egypt", dialCode: "+20" },
    { code: "SV", name: "El Salvador", dialCode: "+503" },
    { code: "GQ", name: "Equatorial Guinea", dialCode: "+240" },
    { code: "ER", name: "Eritrea", dialCode: "+291" },
    { code: "EE", name: "Estonia", dialCode: "+372" },
    { code: "ET", name: "Ethiopia", dialCode: "+251" },
    { code: "FJ", name: "Fiji", dialCode: "+679" },
    { code: "FI", name: "Finland", dialCode: "+358" },
    { code: "FR", name: "France", dialCode: "+33" },
    { code: "GA", name: "Gabon", dialCode: "+241" },
    { code: "GM", name: "Gambia", dialCode: "+220" },
    { code: "GE", name: "Georgia", dialCode: "+995" },
    { code: "DE", name: "Germany", dialCode: "+49" },
    { code: "GH", name: "Ghana", dialCode: "+233" },
    { code: "GR", name: "Greece", dialCode: "+30" },
    { code: "GT", name: "Guatemala", dialCode: "+502" },
    { code: "GN", name: "Guinea", dialCode: "+224" },
    { code: "GW", name: "Guinea-Bissau", dialCode: "+245" },
    { code: "GY", name: "Guyana", dialCode: "+592" },
    { code: "HT", name: "Haiti", dialCode: "+509" },
    { code: "HN", name: "Honduras", dialCode: "+504" },
    { code: "HK", name: "Hong Kong", dialCode: "+852" },
    { code: "HU", name: "Hungary", dialCode: "+36" },
    { code: "IS", name: "Iceland", dialCode: "+354" },
    { code: "IN", name: "India", dialCode: "+91" },
    { code: "ID", name: "Indonesia", dialCode: "+62" },
    { code: "IR", name: "Iran", dialCode: "+98" },
    { code: "IQ", name: "Iraq", dialCode: "+964" },
    { code: "IE", name: "Ireland", dialCode: "+353" },
    { code: "IL", name: "Israel", dialCode: "+972" },
    { code: "IT", name: "Italy", dialCode: "+39" },
    { code: "CI", name: "Ivory Coast", dialCode: "+225" },
    { code: "JM", name: "Jamaica", dialCode: "+1-876" },
    { code: "JP", name: "Japan", dialCode: "+81" },
    { code: "JO", name: "Jordan", dialCode: "+962" },
    { code: "KZ", name: "Kazakhstan", dialCode: "+7" },
    { code: "KE", name: "Kenya", dialCode: "+254" },
    { code: "KW", name: "Kuwait", dialCode: "+965" },
    { code: "KG", name: "Kyrgyzstan", dialCode: "+996" },
    { code: "LA", name: "Laos", dialCode: "+856" },
    { code: "LV", name: "Latvia", dialCode: "+371" },
    { code: "LB", name: "Lebanon", dialCode: "+961" },
    { code: "LS", name: "Lesotho", dialCode: "+266" },
    { code: "LR", name: "Liberia", dialCode: "+231" },
    { code: "LY", name: "Libya", dialCode: "+218" },
    { code: "LI", name: "Liechtenstein", dialCode: "+423" },
    { code: "LT", name: "Lithuania", dialCode: "+370" },
    { code: "LU", name: "Luxembourg", dialCode: "+352" },
    { code: "MO", name: "Macau", dialCode: "+853" },
    { code: "MK", name: "Macedonia", dialCode: "+389" },
    { code: "MG", name: "Madagascar", dialCode: "+261" },
    { code: "MW", name: "Malawi", dialCode: "+265" },
    { code: "MY", name: "Malaysia", dialCode: "+60" },
    { code: "MV", name: "Maldives", dialCode: "+960" },
    { code: "ML", name: "Mali", dialCode: "+223" },
    { code: "MT", name: "Malta", dialCode: "+356" },
    { code: "MR", name: "Mauritania", dialCode: "+222" },
    { code: "MU", name: "Mauritius", dialCode: "+230" },
    { code: "MX", name: "Mexico", dialCode: "+52" },
    { code: "MD", name: "Moldova", dialCode: "+373" },
    { code: "MC", name: "Monaco", dialCode: "+377" },
    { code: "MN", name: "Mongolia", dialCode: "+976" },
    { code: "ME", name: "Montenegro", dialCode: "+382" },
    { code: "MA", name: "Morocco", dialCode: "+212" },
    { code: "MZ", name: "Mozambique", dialCode: "+258" },
    { code: "MM", name: "Myanmar", dialCode: "+95" },
    { code: "NA", name: "Namibia", dialCode: "+264" },
    { code: "NP", name: "Nepal", dialCode: "+977" },
    { code: "NL", name: "Netherlands", dialCode: "+31" },
    { code: "NZ", name: "New Zealand", dialCode: "+64" },
    { code: "NI", name: "Nicaragua", dialCode: "+505" },
    { code: "NE", name: "Niger", dialCode: "+227" },
    { code: "NG", name: "Nigeria", dialCode: "+234" },
    { code: "NO", name: "Norway", dialCode: "+47" },
    { code: "OM", name: "Oman", dialCode: "+968" },
    { code: "PK", name: "Pakistan", dialCode: "+92" },
    { code: "PS", name: "Palestine", dialCode: "+970" },
    { code: "PA", name: "Panama", dialCode: "+507" },
    { code: "PG", name: "Papua New Guinea", dialCode: "+675" },
    { code: "PY", name: "Paraguay", dialCode: "+595" },
    { code: "PE", name: "Peru", dialCode: "+51" },
    { code: "PH", name: "Philippines", dialCode: "+63" },
    { code: "PL", name: "Poland", dialCode: "+48" },
    { code: "PT", name: "Portugal", dialCode: "+351" },
    { code: "QA", name: "Qatar", dialCode: "+974" },
    { code: "RO", name: "Romania", dialCode: "+40" },
    { code: "RU", name: "Russia", dialCode: "+7" },
    { code: "RW", name: "Rwanda", dialCode: "+250" },
    { code: "SA", name: "Saudi Arabia", dialCode: "+966" },
    { code: "SN", name: "Senegal", dialCode: "+221" },
    { code: "RS", name: "Serbia", dialCode: "+381" },
    { code: "SC", name: "Seychelles", dialCode: "+248" },
    { code: "SL", name: "Sierra Leone", dialCode: "+232" },
    { code: "SG", name: "Singapore", dialCode: "+65" },
    { code: "SK", name: "Slovakia", dialCode: "+421" },
    { code: "SI", name: "Slovenia", dialCode: "+386" },
    { code: "SO", name: "Somalia", dialCode: "+252" },
    { code: "ZA", name: "South Africa", dialCode: "+27" },
    { code: "KR", name: "South Korea", dialCode: "+82" },
    { code: "SS", name: "South Sudan", dialCode: "+211" },
    { code: "ES", name: "Spain", dialCode: "+34" },
    { code: "LK", name: "Sri Lanka", dialCode: "+94" },
    { code: "SD", name: "Sudan", dialCode: "+249" },
    { code: "SR", name: "Suriname", dialCode: "+597" },
    { code: "SZ", name: "Swaziland", dialCode: "+268" },
    { code: "SE", name: "Sweden", dialCode: "+46" },
    { code: "CH", name: "Switzerland", dialCode: "+41" },
    { code: "SY", name: "Syria", dialCode: "+963" },
    { code: "TW", name: "Taiwan", dialCode: "+886" },
    { code: "TJ", name: "Tajikistan", dialCode: "+992" },
    { code: "TZ", name: "Tanzania", dialCode: "+255" },
    { code: "TH", name: "Thailand", dialCode: "+66" },
    { code: "TG", name: "Togo", dialCode: "+228" },
    { code: "TO", name: "Tonga", dialCode: "+676" },
    { code: "TT", name: "Trinidad and Tobago", dialCode: "+1-868" },
    { code: "TN", name: "Tunisia", dialCode: "+216" },
    { code: "TR", name: "Turkey", dialCode: "+90" },
    { code: "TM", name: "Turkmenistan", dialCode: "+993" },
    { code: "UG", name: "Uganda", dialCode: "+256" },
    { code: "UA", name: "Ukraine", dialCode: "+380" },
    { code: "AE", name: "United Arab Emirates", dialCode: "+971" },
    { code: "GB", name: "United Kingdom", dialCode: "+44" },
    { code: "US", name: "United States", dialCode: "+1" },
    { code: "UY", name: "Uruguay", dialCode: "+598" },
    { code: "UZ", name: "Uzbekistan", dialCode: "+998" },
    { code: "VU", name: "Vanuatu", dialCode: "+678" },
    { code: "VE", name: "Venezuela", dialCode: "+58" },
    { code: "VN", name: "Vietnam", dialCode: "+84" },
    { code: "YE", name: "Yemen", dialCode: "+967" },
    { code: "ZM", name: "Zambia", dialCode: "+260" },
    { code: "ZW", name: "Zimbabwe", dialCode: "+263" },
  ]
}

interface PhoneInputProps {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  className?: string
}

export function PhoneInput({ value = "", onChange, placeholder = "Enter phone number", className }: PhoneInputProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const countries = React.useMemo(() => getAllCountries(), [])
  const [selectedCountry, setSelectedCountry] = React.useState<Country>(() => {
    const allCountries = getAllCountries()
    return allCountries.find((c: Country) => c.code === "NG") || allCountries[0]
  })
  const [phoneNumber, setPhoneNumber] = React.useState("")
  const [searchQuery, setSearchQuery] = React.useState("")
  const dropdownRef = React.useRef<HTMLDivElement>(null)

  // Filter countries based on search query
  const filteredCountries = React.useMemo(() => {
    if (!searchQuery) return countries
    const query = searchQuery.toLowerCase()
    return countries.filter((country: Country) => 
      country.name.toLowerCase().includes(query) ||
      country.dialCode.includes(query) ||
      country.code.toLowerCase().includes(query)
    )
  }, [countries, searchQuery])

  // Parse initial value if provided
  React.useEffect(() => {
    if (value) {
      // Try to extract country code from value
      const allCountries = getAllCountries()
      const country = allCountries.find((c: Country) => value.startsWith(c.dialCode))
      if (country) {
        setSelectedCountry(country)
        setPhoneNumber(value.substring(country.dialCode.length).trim())
      } else {
        setPhoneNumber(value)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country)
    setIsOpen(false)
    // Update full phone number
    const fullNumber = `${country.dialCode} ${phoneNumber}`.trim()
    onChange?.(fullNumber)
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newNumber = e.target.value.replace(/[^0-9]/g, '') // Only allow numbers
    setPhoneNumber(newNumber)
    // Update full phone number with country code
    const fullNumber = newNumber ? `${selectedCountry.dialCode} ${newNumber}` : ""
    onChange?.(fullNumber)
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {/* Country Selector */}
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 h-10 px-3 py-2 border border-slate-200 bg-white rounded-md hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2"
        >
          <span className="text-xl">{getFlagEmoji(selectedCountry.code)}</span>
          <span className="text-sm font-medium">{selectedCountry.dialCode}</span>
          <ChevronDown className={cn("h-4 w-4 opacity-50 transition-transform", isOpen && "rotate-180")} />
        </button>

        {/* Dropdown */}
        {isOpen && (
          <div className="absolute z-50 mt-1 w-72 bg-white border border-slate-200 rounded-md shadow-lg max-h-80 overflow-hidden">
            {/* Search Input */}
            <div className="sticky top-0 bg-white border-b border-slate-200 p-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search countries..."
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-950"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>

            {/* Countries List */}
            <div className="max-h-60 overflow-auto">
              {filteredCountries.length > 0 ? (
                filteredCountries.map((country: Country) => (
                  <div
                    key={country.code}
                    onClick={() => {
                      handleCountrySelect(country)
                      setSearchQuery("")
                    }}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-slate-100",
                      selectedCountry.code === country.code && "bg-slate-50"
                    )}
                  >
                    <span className="text-xl">{getFlagEmoji(country.code)}</span>
                    <div className="flex-1">
                      <div className="text-sm font-medium">{country.name}</div>
                      <div className="text-xs text-slate-500">{country.dialCode}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-3 py-4 text-center text-sm text-slate-500">
                  No countries found
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Phone Number Input */}
      <input
        type="tel"
        value={phoneNumber}
        onChange={handlePhoneChange}
        placeholder={placeholder}
        className="flex-1 h-10 px-3 py-2 border border-slate-200 bg-white rounded-md text-sm ring-offset-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2"
      />
    </div>
  )
}
