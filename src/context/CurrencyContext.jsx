import { createContext, useState, useContext, useEffect } from 'react';

const CurrencyContext = createContext(null);

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState('USD');
  const [rates, setRates] = useState({ USD: 1 });

  useEffect(() => {
    // Fetch rates from ExchangeRate-API
    fetch('https://api.exchangerate-api.com/v4/latest/USD')
      .then(res => res.json())
      .then(data => {
        setRates(data.rates);
      })
      .catch(err => console.error('Failed to fetch exchange rates', err));
  }, []);

  const formatPrice = (priceInUSD) => {
    const rate = rates[currency] || 1;
    const converted = priceInUSD * rate;
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: currency === 'COP' || currency === 'CLP' ? 0 : 2
    }).format(converted);
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);
