import { useState } from 'react';
import { useEffect } from 'react';

function App(){
  //Variables
  const [cryptoData, setCryptoData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  //Async function to load
  useEffect( ()=>{
    const fetchCrypto = async () =>{
      try{
        const url = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1';
        const response = await fetch(url);
        const data = await response.json();
        setCryptoData(data);
      } catch (error){
        console.error('Error loading the cryptos', error);
      } finally{
        setLoading(false);
      } // Try catch END
    };

    fetchCrypto();

    //Timer to reload every 60 seconds
    const intervalId = setInterval(fetchCrypto, 60000);

    return () => clearInterval(intervalId);
  }, []);

  //Dynamic filter
  const filteredCryptos = cryptoData.filter(coin => 
    coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  //Show on the page
  return(
    <div className="min-h-screen bg-slate-900 text-white p-6 flex flex-col items-center">
      <h1 className="text-3xl font-extrabold text-teal-400 mb-6">Crypto Real-Time Dashboard</h1>
      <input className="w-full max-w-md p-3 bg-slate-800 border border-slate-700 rounded-lg text-white mb-6 placeholder-slate-400 focus:outline-none focus:border-teal-400"
        type='text' placeholder='Search Crypto (ex: Bitcoin)...' value={searchTerm} onChange={(e)=> setSearchTerm(e.target.value)}/>
    {/* Coins list */}
    {loading ?(
      <p className="text-slate-400 animate-pulse mt-4">Cargando mercado financiero...</p>
    ) : (
      <div className="w-full max-w-4xl overflow-x-auto bg-slate-800 rounded-xl shadow-2xl border border-slate-700 p-4">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-700 text-teal-400 text-sm font-semibold">
              <th className="pb-3">#</th>
              <th className="pb-3">Coins</th>
              <th className="pb-3 text-right">Price (USD)</th>
              <th className="pb-3 text-right">Change 24h</th>
            </tr>
          </thead>
          <tbody>
            {filteredCryptos.map((coin, index) => (
              <tr key={coin.id} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors text-sm">
                <td className="py-4 text-slate-400">{coin.market_cap_rank}</td>
                <td className="py-4 flex items-center gap-3">
                  <img src={coin.image} alt={coin.name} className="w-6 h-6" />
                  <span className="font-bold">{coin.name}</span>
                  <span className="text-slate-400 uppercase text-xs">{coin.symbol}</span>
                </td>
                <td className="py-4 text-right font-semibold">${coin.current_price.toLocaleString()}</td>
                <td className={`py-4 text-right font-bold ${coin.price_change_percentage_24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {coin.price_change_percentage_24h.toFixed(2)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
    </div>
  ) //Return END

} // Function APP END


//Obligatory export
export default App