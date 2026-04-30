import React, { useState, useEffect } from 'react'

function WeatherCountryAdvisor({ destination, onSelectDestination }) {
  const [weatherAdvice, setWeatherAdvice] = useState(null);
  const [recommendedCountries, setRecommendedCountries] = useState([]);

  // Complete worldwide country weather data (accurate for all seasons)
  const countryMonthlyTemp = {
    // Europe
    'France': { 'Jan': '5-8°C', 'Feb': '6-10°C', 'Mar': '8-13°C', 'Apr': '13-18°C', 'May': '17-22°C', 'Jun': '20-25°C', 'Jul': '22-27°C', 'Aug': '22-27°C', 'Sep': '18-23°C', 'Oct': '13-18°C', 'Nov': '8-12°C', 'Dec': '5-9°C', flag: '🇫🇷', best: 'Apr-Jun, Sep-Oct' },
    'Italy': { 'Jan': '6-12°C', 'Feb': '7-13°C', 'Mar': '10-16°C', 'Apr': '13-19°C', 'May': '17-23°C', 'Jun': '21-27°C', 'Jul': '24-30°C', 'Aug': '24-30°C', 'Sep': '20-26°C', 'Oct': '15-21°C', 'Nov': '10-16°C', 'Dec': '7-13°C', flag: '🇮🇹', best: 'Apr-Jun, Sep-Oct' },
    'Spain': { 'Jan': '8-15°C', 'Feb': '9-16°C', 'Mar': '11-18°C', 'Apr': '13-20°C', 'May': '16-23°C', 'Jun': '20-28°C', 'Jul': '23-31°C', 'Aug': '23-31°C', 'Sep': '20-27°C', 'Oct': '16-22°C', 'Nov': '11-17°C', 'Dec': '9-15°C', flag: '🇪🇸', best: 'May-Sep' },
    'Germany': { 'Jan': '0-4°C', 'Feb': '1-6°C', 'Mar': '4-10°C', 'Apr': '8-15°C', 'May': '12-19°C', 'Jun': '15-22°C', 'Jul': '17-24°C', 'Aug': '17-24°C', 'Sep': '13-19°C', 'Oct': '9-14°C', 'Nov': '4-9°C', 'Dec': '1-5°C', flag: '🇩🇪', best: 'May-Sep' },
    'United Kingdom': { 'Jan': '4-8°C', 'Feb': '4-9°C', 'Mar': '6-11°C', 'Apr': '8-14°C', 'May': '11-17°C', 'Jun': '14-20°C', 'Jul': '16-22°C', 'Aug': '16-22°C', 'Sep': '13-18°C', 'Oct': '10-15°C', 'Nov': '7-11°C', 'Dec': '5-9°C', flag: '🇬🇧', best: 'May-Sep' },
    'Portugal': { 'Jan': '11-15°C', 'Feb': '11-16°C', 'Mar': '13-18°C', 'Apr': '15-20°C', 'May': '17-22°C', 'Jun': '20-26°C', 'Jul': '22-28°C', 'Aug': '22-28°C', 'Sep': '20-26°C', 'Oct': '17-22°C', 'Nov': '14-18°C', 'Dec': '12-16°C', flag: '🇵🇹', best: 'May-Sep' },
    'Netherlands': { 'Jan': '2-6°C', 'Feb': '2-7°C', 'Mar': '4-10°C', 'Apr': '7-14°C', 'May': '10-18°C', 'Jun': '13-20°C', 'Jul': '15-22°C', 'Aug': '15-22°C', 'Sep': '12-19°C', 'Oct': '9-14°C', 'Nov': '5-10°C', 'Dec': '3-7°C', flag: '🇳🇱', best: 'May-Sep' },
    'Switzerland': { 'Jan': '-2-4°C', 'Feb': '-1-5°C', 'Mar': '2-9°C', 'Apr': '5-13°C', 'May': '9-18°C', 'Jun': '12-21°C', 'Jul': '14-24°C', 'Aug': '14-23°C', 'Sep': '11-19°C', 'Oct': '7-14°C', 'Nov': '2-8°C', 'Dec': '-1-4°C', flag: '🇨🇭', best: 'Jun-Sep' },
    'Austria': { 'Jan': '-3-3°C', 'Feb': '-2-5°C', 'Mar': '2-10°C', 'Apr': '6-15°C', 'May': '10-20°C', 'Jun': '13-23°C', 'Jul': '15-25°C', 'Aug': '15-25°C', 'Sep': '11-20°C', 'Oct': '7-14°C', 'Nov': '2-8°C', 'Dec': '-1-4°C', flag: '🇦🇹', best: 'Jun-Sep' },
    'Greece': { 'Jan': '8-14°C', 'Feb': '8-15°C', 'Mar': '10-17°C', 'Apr': '13-20°C', 'May': '17-24°C', 'Jun': '21-29°C', 'Jul': '24-32°C', 'Aug': '24-32°C', 'Sep': '20-28°C', 'Oct': '16-23°C', 'Nov': '12-18°C', 'Dec': '9-15°C', flag: '🇬🇷', best: 'Apr-Oct' },
    'Croatia': { 'Jan': '6-10°C', 'Feb': '7-11°C', 'Mar': '9-14°C', 'Apr': '12-17°C', 'May': '16-22°C', 'Jun': '20-26°C', 'Jul': '23-29°C', 'Aug': '23-29°C', 'Sep': '19-24°C', 'Oct': '15-20°C', 'Nov': '11-15°C', 'Dec': '8-12°C', flag: '🇭🇷', best: 'May-Sep' },
    'Norway': { 'Jan': '-5-1°C', 'Feb': '-5-1°C', 'Mar': '-2-4°C', 'Apr': '2-9°C', 'May': '7-14°C', 'Jun': '11-18°C', 'Jul': '13-20°C', 'Aug': '12-19°C', 'Sep': '8-14°C', 'Oct': '4-9°C', 'Nov': '0-4°C', 'Dec': '-3-1°C', flag: '🇳🇴', best: 'Jun-Aug' },
    'Sweden': { 'Jan': '-5-0°C', 'Feb': '-5-0°C', 'Mar': '-2-4°C', 'Apr': '2-10°C', 'May': '8-16°C', 'Jun': '12-20°C', 'Jul': '14-22°C', 'Aug': '13-21°C', 'Sep': '9-16°C', 'Oct': '5-10°C', 'Nov': '0-5°C', 'Dec': '-3-1°C', flag: '🇸🇪', best: 'Jun-Aug' },
    'Denmark': { 'Jan': '0-3°C', 'Feb': '0-4°C', 'Mar': '2-7°C', 'Apr': '5-12°C', 'May': '9-17°C', 'Jun': '12-20°C', 'Jul': '14-22°C', 'Aug': '14-21°C', 'Sep': '11-17°C', 'Oct': '7-13°C', 'Nov': '3-8°C', 'Dec': '1-4°C', flag: '🇩🇰', best: 'Jun-Aug' },
    'Finland': { 'Jan': '-8-2°C', 'Feb': '-8-2°C', 'Mar': '-4-3°C', 'Apr': '0-9°C', 'May': '6-15°C', 'Jun': '11-20°C', 'Jul': '13-22°C', 'Aug': '12-20°C', 'Sep': '7-14°C', 'Oct': '3-8°C', 'Nov': '-1-3°C', 'Dec': '-5-0°C', flag: '🇫🇮', best: 'Jun-Aug' },
    'Poland': { 'Jan': '-4-1°C', 'Feb': '-3-2°C', 'Mar': '0-7°C', 'Apr': '5-14°C', 'May': '10-19°C', 'Jun': '13-22°C', 'Jul': '15-24°C', 'Aug': '14-24°C', 'Sep': '10-18°C', 'Oct': '5-12°C', 'Nov': '1-6°C', 'Dec': '-2-2°C', flag: '🇵🇱', best: 'May-Sep' },
    'Czech Republic': { 'Jan': '-3-2°C', 'Feb': '-2-4°C', 'Mar': '1-9°C', 'Apr': '5-15°C', 'May': '10-20°C', 'Jun': '13-22°C', 'Jul': '15-24°C', 'Aug': '14-24°C', 'Sep': '10-19°C', 'Oct': '5-13°C', 'Nov': '1-7°C', 'Dec': '-2-3°C', flag: '🇨🇿', best: 'May-Sep' },
    'Ireland': { 'Jan': '4-8°C', 'Feb': '4-9°C', 'Mar': '5-10°C', 'Apr': '6-12°C', 'May': '9-15°C', 'Jun': '11-18°C', 'Jul': '13-19°C', 'Aug': '13-19°C', 'Sep': '11-17°C', 'Oct': '8-13°C', 'Nov': '5-10°C', 'Dec': '4-8°C', flag: '🇮🇪', best: 'Jun-Aug' },
    'Belgium': { 'Jan': '2-6°C', 'Feb': '2-7°C', 'Mar': '4-11°C', 'Apr': '7-14°C', 'May': '10-18°C', 'Jun': '13-21°C', 'Jul': '15-23°C', 'Aug': '15-23°C', 'Sep': '12-19°C', 'Oct': '8-14°C', 'Nov': '4-9°C', 'Dec': '2-6°C', flag: '🇧🇪', best: 'May-Sep' },
    
    // Asia
    'Japan': { 'Jan': '2-10°C', 'Feb': '3-11°C', 'Mar': '6-15°C', 'Apr': '11-20°C', 'May': '16-24°C', 'Jun': '20-27°C', 'Jul': '24-30°C', 'Aug': '25-31°C', 'Sep': '21-27°C', 'Oct': '15-22°C', 'Nov': '9-17°C', 'Dec': '4-12°C', flag: '🇯🇵', best: 'Mar-May, Sep-Nov' },
    'South Korea': { 'Jan': '-5-2°C', 'Feb': '-3-5°C', 'Mar': '2-11°C', 'Apr': '8-18°C', 'May': '14-23°C', 'Jun': '19-27°C', 'Jul': '22-29°C', 'Aug': '22-30°C', 'Sep': '17-26°C', 'Oct': '10-20°C', 'Nov': '3-12°C', 'Dec': '-2-4°C', flag: '🇰🇷', best: 'Apr-Jun, Sep-Oct' },
    'China': { 'Jan': '-4-6°C', 'Feb': '-1-9°C', 'Mar': '4-15°C', 'Apr': '10-22°C', 'May': '16-27°C', 'Jun': '21-31°C', 'Jul': '24-33°C', 'Aug': '23-32°C', 'Sep': '18-28°C', 'Oct': '11-22°C', 'Nov': '4-14°C', 'Dec': '-2-7°C', flag: '🇨🇳', best: 'Apr-May, Sep-Oct' },
    'India': { 'Jan': '14-25°C', 'Feb': '16-28°C', 'Mar': '20-33°C', 'Apr': '24-38°C', 'May': '27-40°C', 'Jun': '27-38°C', 'Jul': '26-34°C', 'Aug': '25-33°C', 'Sep': '24-33°C', 'Oct': '21-32°C', 'Nov': '17-29°C', 'Dec': '13-26°C', flag: '🇮🇳', best: 'Oct-Mar' },
    'Thailand': { 'Jan': '22-32°C', 'Feb': '23-33°C', 'Mar': '24-34°C', 'Apr': '25-35°C', 'May': '25-34°C', 'Jun': '25-33°C', 'Jul': '24-32°C', 'Aug': '24-32°C', 'Sep': '24-32°C', 'Oct': '24-32°C', 'Nov': '23-31°C', 'Dec': '22-30°C', flag: '🇹🇭', best: 'Nov-Mar' },
    'Vietnam': { 'Jan': '20-25°C', 'Feb': '21-27°C', 'Mar': '23-30°C', 'Apr': '25-33°C', 'May': '26-34°C', 'Jun': '26-34°C', 'Jul': '25-33°C', 'Aug': '25-33°C', 'Sep': '24-31°C', 'Oct': '23-30°C', 'Nov': '22-28°C', 'Dec': '20-26°C', flag: '🇻🇳', best: 'Nov-Apr' },
    'Indonesia': { 'Jan': '24-31°C', 'Feb': '24-31°C', 'Mar': '24-32°C', 'Apr': '24-32°C', 'May': '24-32°C', 'Jun': '24-31°C', 'Jul': '23-31°C', 'Aug': '23-31°C', 'Sep': '24-31°C', 'Oct': '24-32°C', 'Nov': '24-32°C', 'Dec': '24-31°C', flag: '🇮🇩', best: 'Apr-Oct' },
    'Malaysia': { 'Jan': '25-32°C', 'Feb': '25-32°C', 'Mar': '25-33°C', 'Apr': '25-33°C', 'May': '25-33°C', 'Jun': '25-32°C', 'Jul': '24-32°C', 'Aug': '24-32°C', 'Sep': '24-32°C', 'Oct': '24-32°C', 'Nov': '24-32°C', 'Dec': '24-32°C', flag: '🇲🇾', best: 'Dec-Feb' },
    'Singapore': { 'Jan': '25-31°C', 'Feb': '25-32°C', 'Mar': '25-32°C', 'Apr': '25-32°C', 'May': '25-32°C', 'Jun': '25-31°C', 'Jul': '25-31°C', 'Aug': '25-31°C', 'Sep': '25-31°C', 'Oct': '25-31°C', 'Nov': '25-31°C', 'Dec': '25-31°C', flag: '🇸🇬', best: 'Feb-Apr' },
    'Philippines': { 'Jan': '24-30°C', 'Feb': '24-31°C', 'Mar': '25-32°C', 'Apr': '26-33°C', 'May': '26-33°C', 'Jun': '25-32°C', 'Jul': '25-31°C', 'Aug': '24-31°C', 'Sep': '24-31°C', 'Oct': '24-31°C', 'Nov': '24-31°C', 'Dec': '24-30°C', flag: '🇵🇭', best: 'Dec-Apr' },
    'Nepal': { 'Jan': '2-12°C', 'Feb': '4-15°C', 'Mar': '8-18°C', 'Apr': '11-22°C', 'May': '15-25°C', 'Jun': '18-28°C', 'Jul': '20-28°C', 'Aug': '20-28°C', 'Sep': '18-26°C', 'Oct': '12-23°C', 'Nov': '8-18°C', 'Dec': '4-14°C', flag: '🇳🇵', best: 'Mar-May, Sep-Nov' },
    'Sri Lanka': { 'Jan': '23-30°C', 'Feb': '23-31°C', 'Mar': '24-31°C', 'Apr': '24-32°C', 'May': '25-31°C', 'Jun': '25-30°C', 'Jul': '25-30°C', 'Aug': '25-30°C', 'Sep': '25-30°C', 'Oct': '24-30°C', 'Nov': '23-30°C', 'Dec': '23-29°C', flag: '🇱🇰', best: 'Dec-Mar' },
    'Maldives': { 'Jan': '27-30°C', 'Feb': '27-30°C', 'Mar': '28-31°C', 'Apr': '28-31°C', 'May': '28-31°C', 'Jun': '28-30°C', 'Jul': '27-30°C', 'Aug': '27-30°C', 'Sep': '27-30°C', 'Oct': '27-30°C', 'Nov': '27-30°C', 'Dec': '27-30°C', flag: '🇲🇻', best: 'Nov-Apr' },
    
    // Middle East
    'Turkey': { 'Jan': '4-10°C', 'Feb': '5-11°C', 'Mar': '7-14°C', 'Apr': '11-18°C', 'May': '15-23°C', 'Jun': '19-28°C', 'Jul': '22-31°C', 'Aug': '22-31°C', 'Sep': '18-27°C', 'Oct': '14-21°C', 'Nov': '9-15°C', 'Dec': '6-11°C', flag: '🇹🇷', best: 'Apr-Oct' },
    'UAE': { 'Jan': '18-24°C', 'Feb': '19-25°C', 'Mar': '21-28°C', 'Apr': '24-33°C', 'May': '28-38°C', 'Jun': '30-40°C', 'Jul': '32-42°C', 'Aug': '32-42°C', 'Sep': '29-39°C', 'Oct': '26-35°C', 'Nov': '22-30°C', 'Dec': '19-26°C', flag: '🇦🇪', best: 'Nov-Mar' },
    'Egypt': { 'Jan': '14-22°C', 'Feb': '15-24°C', 'Mar': '18-27°C', 'Apr': '21-31°C', 'May': '24-34°C', 'Jun': '27-36°C', 'Jul': '28-37°C', 'Aug': '28-37°C', 'Sep': '26-34°C', 'Oct': '23-31°C', 'Nov': '19-27°C', 'Dec': '15-23°C', flag: '🇪🇬', best: 'Oct-Apr' },
    'Jordan': { 'Jan': '8-14°C', 'Feb': '9-16°C', 'Mar': '12-20°C', 'Apr': '16-25°C', 'May': '20-30°C', 'Jun': '23-33°C', 'Jul': '25-35°C', 'Aug': '25-35°C', 'Sep': '22-32°C', 'Oct': '18-28°C', 'Nov': '13-21°C', 'Dec': '9-15°C', flag: '🇯🇴', best: 'Mar-May, Sep-Nov' },
    'Israel': { 'Jan': '10-17°C', 'Feb': '11-18°C', 'Mar': '13-21°C', 'Apr': '16-25°C', 'May': '20-29°C', 'Jun': '23-32°C', 'Jul': '25-34°C', 'Aug': '25-34°C', 'Sep': '23-31°C', 'Oct': '19-28°C', 'Nov': '14-23°C', 'Dec': '11-19°C', flag: '🇮🇱', best: 'Mar-May, Sep-Nov' },
    'Saudi Arabia': { 'Jan': '12-22°C', 'Feb': '14-24°C', 'Mar': '18-29°C', 'Apr': '22-34°C', 'May': '27-39°C', 'Jun': '29-42°C', 'Jul': '30-43°C', 'Aug': '30-43°C', 'Sep': '27-40°C', 'Oct': '23-35°C', 'Nov': '18-28°C', 'Dec': '13-23°C', flag: '🇸🇦', best: 'Nov-Mar' },
    
    // Africa
    'Morocco': { 'Jan': '9-18°C', 'Feb': '10-19°C', 'Mar': '12-21°C', 'Apr': '14-23°C', 'May': '17-26°C', 'Jun': '20-29°C', 'Jul': '22-33°C', 'Aug': '22-33°C', 'Sep': '20-30°C', 'Oct': '17-26°C', 'Nov': '13-21°C', 'Dec': '10-19°C', flag: '🇲🇦', best: 'Mar-May, Sep-Nov' },
    'South Africa': { 'Jan': '18-28°C', 'Feb': '18-28°C', 'Mar': '16-26°C', 'Apr': '13-23°C', 'May': '10-20°C', 'Jun': '7-18°C', 'Jul': '7-18°C', 'Aug': '8-19°C', 'Sep': '11-22°C', 'Oct': '14-24°C', 'Nov': '16-26°C', 'Dec': '17-27°C', flag: '🇿🇦', best: 'Sep-Apr' },
    'Kenya': { 'Jan': '17-28°C', 'Feb': '17-29°C', 'Mar': '18-29°C', 'Apr': '18-28°C', 'May': '17-27°C', 'Jun': '16-26°C', 'Jul': '15-25°C', 'Aug': '15-25°C', 'Sep': '16-27°C', 'Oct': '17-27°C', 'Nov': '17-27°C', 'Dec': '17-27°C', flag: '🇰🇪', best: 'Jan-Feb, Jun-Sep' },
    'Tanzania': { 'Jan': '20-30°C', 'Feb': '20-30°C', 'Mar': '20-30°C', 'Apr': '19-29°C', 'May': '18-28°C', 'Jun': '17-27°C', 'Jul': '16-26°C', 'Aug': '17-27°C', 'Sep': '18-28°C', 'Oct': '19-29°C', 'Nov': '19-29°C', 'Dec': '20-30°C', flag: '🇹🇿', best: 'Jun-Oct' },
    
    // Americas
    'USA': { 'Jan': '-2-8°C', 'Feb': '0-10°C', 'Mar': '4-15°C', 'Apr': '9-20°C', 'May': '14-25°C', 'Jun': '19-29°C', 'Jul': '22-32°C', 'Aug': '21-31°C', 'Sep': '17-27°C', 'Oct': '10-21°C', 'Nov': '4-14°C', 'Dec': '0-9°C', flag: '🇺🇸', best: 'Apr-Jun, Sep-Oct' },
    'Canada': { 'Jan': '-10-0°C', 'Feb': '-8-1°C', 'Mar': '-3-6°C', 'Apr': '3-12°C', 'May': '9-18°C', 'Jun': '14-23°C', 'Jul': '17-26°C', 'Aug': '16-25°C', 'Sep': '11-20°C', 'Oct': '5-13°C', 'Nov': '0-6°C', 'Dec': '-6-1°C', flag: '🇨🇦', best: 'Jun-Sep' },
    'Mexico': { 'Jan': '14-24°C', 'Feb': '15-25°C', 'Mar': '17-27°C', 'Apr': '19-29°C', 'May': '21-31°C', 'Jun': '22-31°C', 'Jul': '22-31°C', 'Aug': '22-31°C', 'Sep': '21-30°C', 'Oct': '19-28°C', 'Nov': '16-26°C', 'Dec': '14-24°C', flag: '🇲🇽', best: 'Nov-Apr' },
    'Brazil': { 'Jan': '22-33°C', 'Feb': '22-33°C', 'Mar': '22-32°C', 'Apr': '20-30°C', 'May': '18-28°C', 'Jun': '17-27°C', 'Jul': '16-26°C', 'Aug': '17-27°C', 'Sep': '18-28°C', 'Oct': '20-30°C', 'Nov': '21-31°C', 'Dec': '22-32°C', flag: '🇧🇷', best: 'Sep-Oct' },
    'Argentina': { 'Jan': '20-30°C', 'Feb': '19-29°C', 'Mar': '17-27°C', 'Apr': '13-23°C', 'May': '10-19°C', 'Jun': '7-15°C', 'Jul': '6-15°C', 'Aug': '8-17°C', 'Sep': '10-19°C', 'Oct': '13-22°C', 'Nov': '16-25°C', 'Dec': '18-28°C', flag: '🇦🇷', best: 'Oct-Apr' },
    'Chile': { 'Jan': '14-28°C', 'Feb': '13-27°C', 'Mar': '11-25°C', 'Apr': '8-21°C', 'May': '6-18°C', 'Jun': '4-15°C', 'Jul': '3-14°C', 'Aug': '4-16°C', 'Sep': '6-18°C', 'Oct': '8-20°C', 'Nov': '10-23°C', 'Dec': '12-26°C', flag: '🇨🇱', best: 'Dec-Mar' },
    'Peru': { 'Jan': '18-27°C', 'Feb': '18-27°C', 'Mar': '18-27°C', 'Apr': '17-26°C', 'May': '16-24°C', 'Jun': '15-23°C', 'Jul': '14-22°C', 'Aug': '14-22°C', 'Sep': '15-23°C', 'Oct': '16-24°C', 'Nov': '17-25°C', 'Dec': '18-26°C', flag: '🇵🇪', best: 'May-Sep' },
    'Colombia': { 'Jan': '14-26°C', 'Feb': '14-26°C', 'Mar': '14-26°C', 'Apr': '14-26°C', 'May': '14-26°C', 'Jun': '14-26°C', 'Jul': '14-26°C', 'Aug': '14-26°C', 'Sep': '14-26°C', 'Oct': '14-26°C', 'Nov': '14-26°C', 'Dec': '14-26°C', flag: '🇨🇴', best: 'Dec-Mar' },
    'Costa Rica': { 'Jan': '22-30°C', 'Feb': '22-30°C', 'Mar': '22-31°C', 'Apr': '22-31°C', 'May': '22-30°C', 'Jun': '22-29°C', 'Jul': '22-29°C', 'Aug': '22-29°C', 'Sep': '22-29°C', 'Oct': '22-29°C', 'Nov': '22-29°C', 'Dec': '22-29°C', flag: '🇨🇷', best: 'Dec-Apr' },
    
    // Oceania
    'Australia': { 'Jan': '19-29°C', 'Feb': '19-29°C', 'Mar': '17-27°C', 'Apr': '14-24°C', 'May': '11-20°C', 'Jun': '8-17°C', 'Jul': '7-16°C', 'Aug': '8-17°C', 'Sep': '10-20°C', 'Oct': '13-23°C', 'Nov': '16-26°C', 'Dec': '18-28°C', flag: '🇦🇺', best: 'Sep-Nov, Mar-May' },
    'New Zealand': { 'Jan': '14-23°C', 'Feb': '14-23°C', 'Mar': '12-21°C', 'Apr': '9-18°C', 'May': '7-15°C', 'Jun': '5-13°C', 'Jul': '4-12°C', 'Aug': '5-13°C', 'Sep': '7-15°C', 'Oct': '9-17°C', 'Nov': '11-19°C', 'Dec': '13-21°C', flag: '🇳🇿', best: 'Dec-Mar' },
    'Fiji': { 'Jan': '23-31°C', 'Feb': '23-31°C', 'Mar': '23-31°C', 'Apr': '22-30°C', 'May': '21-28°C', 'Jun': '20-27°C', 'Jul': '19-26°C', 'Aug': '19-26°C', 'Sep': '20-27°C', 'Oct': '21-28°C', 'Nov': '22-29°C', 'Dec': '23-30°C', flag: '🇫🇯', best: 'May-Oct' }
  };

  const getCurrentMonth = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[new Date().getMonth()];
  };

  const getWeatherAdviceForDestination = (destinationName) => {
    if (!destinationName) return null;
    
    const currentMonth = getCurrentMonth();
    const countryData = countryMonthlyTemp[destinationName];
    
    if (!countryData) return null;
    
    const monthlyTemp = countryData[currentMonth];
    const bestMonths = countryData.best;
    const isGoodTime = bestMonths.includes(currentMonth);
    
    return {
      country: destinationName,
      temp: monthlyTemp,
      flag: countryData.flag,
      bestMonths: bestMonths,
      currentMonth,
      isGoodTime,
      recommendation: isGoodTime ? '✅ GOOD TIME TO VISIT' : '⚠️ NOT IDEAL TIME',
      advice: isGoodTime ? 
        `Great time to visit ${destinationName}! ${monthlyTemp}.` :
        `Not the best time for ${destinationName}. Best months: ${bestMonths}`
    };
  };

  const getRandomRecommendations = () => {
    const countries = Object.keys(countryMonthlyTemp);
    const shuffled = [...countries];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, 8).map(country => getWeatherAdviceForDestination(country)).filter(c => c !== null);
  };

  useEffect(() => {
    setRecommendedCountries(getRandomRecommendations());
  }, []);

  useEffect(() => {
    if (destination) {
      let matchedCountry = null;
      for (const country of Object.keys(countryMonthlyTemp)) {
        if (destination.toLowerCase().includes(country.toLowerCase())) {
          matchedCountry = country;
          break;
        }
      }
      if (matchedCountry) {
        setWeatherAdvice(getWeatherAdviceForDestination(matchedCountry));
      } else {
        setWeatherAdvice(null);
      }
    } else {
      setWeatherAdvice(null);
    }
  }, [destination]);

  const currentMonth = getCurrentMonth();

  return (
    <div style={{ marginTop: '30px', marginBottom: '30px' }}>
      {/* Weather Advice for Selected Destination */}
      {weatherAdvice && (
        <div style={{
          backgroundColor: weatherAdvice.isGoodTime ? '#f0fdf4' : '#fef2f2',
          border: `1px solid ${weatherAdvice.isGoodTime ? '#bbf7d0' : '#fecaca'}`,
          borderRadius: '16px',
          padding: '20px',
          marginBottom: '24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <span style={{ fontSize: '32px' }}>{weatherAdvice.isGoodTime ? '✅' : '⚠️'}</span>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: weatherAdvice.isGoodTime ? '#166534' : '#991b1b', margin: 0, fontFamily: 'inherit' }}>
              {weatherAdvice.recommendation}
            </h3>
          </div>
          <p style={{ marginBottom: '12px', color: '#4b5563', fontFamily: 'inherit' }}>{weatherAdvice.advice}</p>
          <div style={{ 
            display: 'inline-block', 
            padding: '4px 12px', 
            backgroundColor: weatherAdvice.isGoodTime ? '#dcfce7' : '#fee2e2', 
            borderRadius: '20px',
            fontSize: '12px',
            fontFamily: 'inherit'
          }}>
            🌡️ {weatherAdvice.temp}
          </div>
        </div>
      )}

      {/* Best Countries Section */}
      <div>
        <h3 style={{ 
          fontSize: '20px', 
          fontWeight: 'bold', 
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontFamily: 'inherit'
        }}>
          <span>🌟</span> Best Countries to Visit in {currentMonth}
        </h3>
        
        {/* RESPONSIVE GRID - Updated for all devices */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '20px'
        }}>
          {recommendedCountries.map((country, idx) => (
            <div 
              key={idx} 
              onClick={() => onSelectDestination && onSelectDestination(country.country)} 
              style={{
                cursor: 'pointer',
                background: 'white',
                borderRadius: '20px',
                overflow: 'hidden',
                border: '1px solid #e5e7eb',
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 15px 30px -12px rgba(0,0,0,0.15)';
                e.currentTarget.style.borderColor = '#c7d2fe';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)';
                e.currentTarget.style.borderColor = '#e5e7eb';
              }}
            >
              {/* Card Header with Flag and Country Name - Responsive */}
              <div style={{
                padding: 'clamp(12px, 4vw, 20px) clamp(12px, 4vw, 20px) 8px clamp(12px, 4vw, 20px)',
                borderBottom: '1px solid #f3f4f6',
                display: 'flex',
                alignItems: 'center',
                gap: 'clamp(8px, 3vw, 12px)',
                flexWrap: 'wrap'
              }}>
                <span style={{ fontSize: 'clamp(28px, 8vw, 36px)' }}>{country.flag || '🌍'}</span>
                <div>
                  <h3 style={{ 
                    fontSize: 'clamp(16px, 4vw, 20px)', 
                    fontWeight: 'bold', 
                    margin: 0,
                    color: '#1f2937',
                    fontFamily: 'inherit'
                  }}>
                    {country.country}
                  </h3>
                  <span style={{ 
                    fontSize: 'clamp(10px, 3vw, 11px)', 
                    color: '#10b981',
                    background: '#d1fae5',
                    padding: '2px 8px',
                    borderRadius: '20px',
                    marginTop: '4px',
                    display: 'inline-block'
                  }}>
                    {country.isGoodTime ? '⭐ Peak Season' : '🕐 Off Season'}
                  </span>
                </div>
              </div>
              
              {/* Card Body - Responsive */}
              <div style={{ 
                padding: 'clamp(12px, 4vw, 16px) clamp(12px, 4vw, 20px)' 
              }}>
                {/* Temperature - Responsive */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '12px',
                  background: '#fef3c7',
                  padding: 'clamp(6px, 2vw, 8px) clamp(8px, 3vw, 12px)',
                  borderRadius: '12px',
                  flexWrap: 'wrap'
                }}>
                  <span style={{ fontSize: 'clamp(16px, 5vw, 20px)' }}>🌡️</span>
                  <div>
                    <div style={{ fontSize: 'clamp(10px, 3vw, 11px)', color: '#92400e' }}>Expected Temperature</div>
                    <div style={{ fontSize: 'clamp(14px, 4vw, 18px)', fontWeight: 'bold', color: '#92400e', fontFamily: 'inherit' }}>{country.temp}</div>
                  </div>
                </div>
                
                {/* Best Months - Responsive */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '16px',
                  flexWrap: 'wrap'
                }}>
                  <span style={{ fontSize: 'clamp(14px, 4vw, 16px)' }}>📅</span>
                  <div>
                    <div style={{ fontSize: 'clamp(10px, 3vw, 11px)', color: '#6b7280' }}>Best Time to Visit</div>
                    <div style={{ fontSize: 'clamp(11px, 3vw, 13px)', fontWeight: '500', color: '#374151', fontFamily: 'inherit' }}>{country.bestMonths}</div>
                  </div>
                </div>
              </div>
              
              {/* Card Footer - Responsive */}
              <div style={{
                padding: 'clamp(10px, 3vw, 12px) clamp(12px, 4vw, 20px)',
                background: '#f8fafc',
                borderTop: '1px solid #e5e7eb',
                textAlign: 'center'
              }}>
                <span style={{ 
                  fontSize: 'clamp(11px, 3vw, 13px)', 
                  fontWeight: '500', 
                  color: '#3b82f6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  fontFamily: 'inherit',
                  flexWrap: 'wrap'
                }}>
                  Click to plan your trip → 
                  <span style={{ fontSize: 'clamp(12px, 4vw, 16px)' }}>✈️</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default WeatherCountryAdvisor;