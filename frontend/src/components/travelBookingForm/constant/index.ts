const interestOptions = [
    {id: "1", value: "Heritage"},
    {id: "2", value: "Night Life"},
    {id: "3", value: "Adventure"},
    {id: "4", value: "Food"},
  ]

// Create a unique list of cities by removing duplicates
  const allCities = [
    // Major Metropolitan Cities
    'Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune', 'Ahmedabad',
    
    // Tier 1 Cities
    'Jaipur', 'Surat', 'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Thane', 'Bhopal',
    'Visakhapatnam', 'Patna', 'Vadodara', 'Ghaziabad', 'Ludhiana', 'Agra', 'Nashik',
    'Faridabad', 'Meerut', 'Rajkot', 'Varanasi', 'Srinagar', 'Aurangabad', 'Solapur',
    'Vijayawada', 'Kolhapur', 'Amritsar', 'Sangli', 'Malegaon', 'Ulhasnagar', 'Jalgaon',
    
    // Tier 2 Cities
    'Akola', 'Latur', 'Ahmadnagar', 'Dhule', 'Ichalkaranji', 'Parbhani', 'Jalna',
    'Bhusawal', 'Panvel', 'Satara', 'Beed', 'Yavatmal', 'Kamptee', 'Gondia', 'Barshi',
    'Achalpur', 'Osmanabad', 'Nanded', 'Wardha', 'Udgir', 'Amalner', 'Akot',
    'Pandharpur', 'Shirpur', 'Parli', 'Shahada', 'Shirur', 'Pusad', 'Purna',
    'Satana', 'Malkapur', 'Mukhed', 'Mangrulpir', 'Risod', 'Washim', 'Khamgaon',
    'Manmad', 'Rahuri', 'Paratwada', 'Dharangaon', 'Chalisgaon', 'Bhadravati',
    'Erandol', 'Faizpur', 'Yawal', 'Sangamner', 'Shirdi', 'Kopargaon', 'Yeola',
    'Sinnar', 'Igatpuri', 'Dindori', 'Lasalgaon', 'Deolali', 'Nandurbar', 'Navapur',
    'Taloda', 'Akkalkuwa', 'Dhadgaon', 'Pimpalner', 'Vikramgad', 'Jawhar', 'Mokhada',
    'Vada', 'Palghar', 'Vasai', 'Virar', 'Nala Sopara', 'Bhiwandi', 'Kalyan',
    'Dombivali', 'Ambernath', 'Badlapur', 'Karjat', 'Khopoli', 'Murbad', 'Shahapur',
    
    // Union Territories & Special Cities
    'Chandigarh', 'Puducherry', 'Daman', 'Diu', 'Dadra and Nagar Haveli',
    'Lakshadweep', 'Andaman and Nicobar Islands',
    
    // Popular Tourist Destinations
    'Goa', 'Shimla', 'Manali', 'Ooty', 'Mysore', 'Kochi', 'Trivandrum', 'Coimbatore',
    'Madurai', 'Tiruchirapalli', 'Salem', 'Tirunelveli', 'Erode', 'Thanjavur',
    'Udaipur', 'Jodhpur', 'Bikaner', 'Ajmer', 'Kota', 'Bharatpur', 'Alwar',
    'Mount Abu', 'Pushkar', 'Jaisalmer', 'Bundi', 'Chittorgarh', 'Sikar',
    'Gangtok', 'Darjeeling', 'Kalimpong', 'Siliguri', 'Burdwan', 'Asansol',
    'Durgapur', 'Bardhaman', 'Malda', 'Jalpaiguri', 'Cooch Behar', 'Balurghat',
    'Raiganj', 'Krishnanagar', 'Baharampur', 'Medinipur', 'Tamluk', 'Haldia',
    'Kharagpur', 'Midnapore', 'Bankura', 'Purulia', 'Jhargram', 'Alipurduar',
    'Howrah', 'North 24 Parganas', 'South 24 Parganas', 'Nadia', 'Murshidabad',
    'Birbhum', 'Hooghly', 'East Midnapore', 'West Midnapore',
    
    // Additional Major Cities
    'Gurgaon', 'Noida', 'Greater Noida', 'Bareilly', 'Moradabad', 'Saharanpur', 
    'Muzaffarnagar', 'Shahjahanpur', 'Rampur', 'Firozabad', 'Etawah', 'Mainpuri', 
    'Mathura', 'Aligarh', 'Hathras', 'Kasganj', 'Etah'
  ]

const APP_NAME = 'travel_agent'
const USER_ID = 'user'

export { interestOptions, allCities, APP_NAME, USER_ID }