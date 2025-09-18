import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Progress } from '@/components/ui/progress.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { 
  Zap, Clock, DollarSign, Flame, Trophy, Play, RotateCcw,
  Server, Coins, Wallet, History, Info, CreditCard, Activity,
  TrendingUp, Users, RefreshCw, Monitor, Terminal
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState('live-demo')
  const [raceState, setRaceState] = useState('ready')
  const [orgoTime, setOrgoTime] = useState(0)
  const [paypalTime, setPaypalTime] = useState(0)
  const [orgoStatus, setOrgoStatus] = useState('Ready to transfer $10,000 USD → PHP')
  const [paypalStatus, setPaypalStatus] = useState('Ready to transfer $10,000 USD → PHP')
  const [orgoBurnAmount, setOrgoBurnAmount] = useState(0)
  const [orgoProgress, setOrgoProgress] = useState(0)
  const [paypalProgress, setPaypalProgress] = useState(0)
  const [winner, setWinner] = useState(null)
  const [paymentAmount, setPaymentAmount] = useState('')
  const [recipientAddress, setRecipientAddress] = useState('')
  const [paymentStatus, setPaymentStatus] = useState('ready')
  
  const orgoTimerRef = useRef(null)
  const paypalTimerRef = useRef(null)
  const orgoStartTime = useRef(null)
  const paypalStartTime = useRef(null)

  const startRace = async () => {
    setRaceState('racing')
    setOrgoTime(0)
    setPaypalTime(0)
    setOrgoProgress(0)
    setPaypalProgress(0)
    setOrgoBurnAmount(0)
    setWinner(null)
    
    orgoStartTime.current = Date.now()
    paypalStartTime.current = Date.now()
    
    startOrgoProcess()
    startPayPalProcess()
    
    orgoTimerRef.current = setInterval(() => {
      const elapsed = Date.now() - orgoStartTime.current
      setOrgoTime(elapsed)
    }, 10)
    
    paypalTimerRef.current = setInterval(() => {
      const elapsed = Date.now() - paypalStartTime.current
      setPaypalTime(elapsed)
    }, 10)
  }

  const startOrgoProcess = async () => {
    setOrgoStatus('🔐 Verifying ZK identity proof...')
    setOrgoProgress(10)
    await sleep(50)
    
    setOrgoStatus('⚡ Executing pre-signed transaction...')
    setOrgoProgress(25)
    await sleep(30)
    
    setOrgoStatus('🔄 Atomic swap: USD → USDC...')
    setOrgoProgress(45)
    await sleep(80)
    
    setOrgoStatus('🌉 Cross-chain bridge to Solana...')
    setOrgoProgress(65)
    await sleep(60)
    
    setOrgoStatus('🔥 Burning ORGO tokens (0.1% fee)...')
    setOrgoProgress(80)
    let burnCount = 0
    const burnInterval = setInterval(() => {
      burnCount += 0.2
      setOrgoBurnAmount(burnCount)
      if (burnCount >= 10) clearInterval(burnInterval)
    }, 2)
    await sleep(20)
    
    setOrgoStatus('💱 Liquidity pool: USDC → PHP...')
    setOrgoProgress(95)
    await sleep(40)
    
    setOrgoStatus('✅ Transfer complete! ₱580,000 delivered')
    setOrgoProgress(100)
    await sleep(20)
    
    clearInterval(orgoTimerRef.current)
    const finalTime = Date.now() - orgoStartTime.current
    setOrgoTime(finalTime)
    
    if (!winner) setWinner('orgo')
  }

  const startPayPalProcess = async () => {
    setPaypalStatus('🔑 Authenticating user credentials...')
    setPaypalProgress(5)
    await sleep(500)
    
    setPaypalStatus('🛡️ Running fraud detection checks...')
    setPaypalProgress(15)
    await sleep(400)
    
    setPaypalStatus('🏦 Verifying bank account details...')
    setPaypalProgress(30)
    await sleep(600)
    
    setPaypalStatus('💱 Converting USD to PHP...')
    setPaypalProgress(45)
    await sleep(300)
    
    setPaypalStatus('🌍 Processing international transfer...')
    setPaypalProgress(65)
    await sleep(800)
    
    setPaypalStatus('📋 Running compliance checks...')
    setPaypalProgress(80)
    await sleep(500)
    
    setPaypalStatus('⏳ Awaiting bank settlement...')
    setPaypalProgress(95)
    await sleep(400)
    
    setPaypalStatus('✅ Transfer complete! ₱580,000 delivered')
    setPaypalProgress(100)
    
    clearInterval(paypalTimerRef.current)
    const finalTime = Date.now() - paypalStartTime.current
    setPaypalTime(finalTime)
    
    if (!winner) setWinner('paypal')
  }

  const resetRace = () => {
    setRaceState('ready')
    setOrgoTime(0)
    setPaypalTime(0)
    setOrgoStatus('Ready to transfer $10,000 USD → PHP')
    setPaypalStatus('Ready to transfer $10,000 USD → PHP')
    setOrgoBurnAmount(0)
    setOrgoProgress(0)
    setPaypalProgress(0)
    setWinner(null)
    
    if (orgoTimerRef.current) clearInterval(orgoTimerRef.current)
    if (paypalTimerRef.current) clearInterval(paypalTimerRef.current)
  }

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

  const handlePayment = async () => {
    if (!paymentAmount || !recipientAddress) return
    setPaymentStatus('processing')
    await sleep(2000)
    setPaymentStatus('completed')
    setTimeout(() => {
      setPaymentStatus('ready')
      setPaymentAmount('')
      setRecipientAddress('')
    }, 3000)
  }

  useEffect(() => {
    return () => {
      if (orgoTimerRef.current) clearInterval(orgoTimerRef.current)
      if (paypalTimerRef.current) clearInterval(paypalTimerRef.current)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <motion.h1 
            className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            OrgoRush Payment Agent
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-600 mb-6"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Built using ORGO Computer Environment - AI-Powered Web3 Payment Platform
          </motion.p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-7 mb-8">
            <TabsTrigger value="live-demo"><Play className="w-4 h-4 mr-1" />Live Demo</TabsTrigger>
            <TabsTrigger value="vm-dashboard"><Server className="w-4 h-4 mr-1" />VM Dashboard</TabsTrigger>
            <TabsTrigger value="payment"><CreditCard className="w-4 h-4 mr-1" />Payment</TabsTrigger>
            <TabsTrigger value="token-info"><Info className="w-4 h-4 mr-1" />Token Info</TabsTrigger>
            <TabsTrigger value="wallet"><Wallet className="w-4 h-4 mr-1" />Wallet</TabsTrigger>
            <TabsTrigger value="history"><History className="w-4 h-4 mr-1" />History</TabsTrigger>
            <TabsTrigger value="live-speed-demo"><Activity className="w-4 h-4 mr-1" />Live Speed Demo</TabsTrigger>
          </TabsList>

          <TabsContent value="live-demo" className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">$10,000 USD → Philippines Peso Transfer Race</h2>
              <div className="flex gap-4 justify-center mb-8">
                <Button onClick={startRace} disabled={raceState === 'racing'} size="lg" className="bg-gradient-to-r from-green-500 to-blue-500">
                  <Play className="mr-2 h-5 w-5" />Start Race
                </Button>
                <Button onClick={resetRace} variant="outline" size="lg">
                  <RotateCcw className="mr-2 h-5 w-5" />Reset
                </Button>
              </div>
            </div>

            <AnimatePresence>
              {winner && (
                <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="mb-8">
                  <Card className="bg-gradient-to-r from-yellow-100 to-orange-100 border-yellow-300">
                    <CardContent className="p-6 text-center">
                      <div className="flex items-center justify-center gap-3 mb-2">
                        <Trophy className="h-8 w-8 text-yellow-600" />
                        <h2 className="text-2xl font-bold text-yellow-800">
                          {winner === 'orgo' ? 'OrgoRush Wins!' : 'PayPal Wins!'}
                        </h2>
                        <Trophy className="h-8 w-8 text-yellow-600" />
                      </div>
                      <p className="text-lg text-yellow-700">
                        OrgoRush: {orgoTime}ms vs PayPal: {paypalTime}ms
                        <br />
                        <span className="font-semibold">
                          {winner === 'orgo' ? `${((paypalTime - orgoTime) / orgoTime * 100).toFixed(0)}x faster!` : 'Unexpected!'}
                        </span>
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="grid md:grid-cols-2 gap-8">
              <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-blue-800 flex items-center gap-2">
                    <Zap className="h-6 w-6" />OrgoRush Agent
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center">
                    <div className="text-4xl font-mono font-bold text-blue-600 mb-2">{orgoTime.toFixed(0)}ms</div>
                    <Progress value={orgoProgress} className="h-3" />
                  </div>
                  <div className="bg-white/50 rounded-lg p-4">
                    <p className="text-sm text-gray-700">{orgoStatus}</p>
                  </div>
                  <div className="bg-gradient-to-r from-orange-100 to-red-100 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Flame className="h-5 w-5 text-orange-600" />
                      <span className="font-semibold text-orange-800">ORGO Burn Counter</span>
                    </div>
                    <div className="text-2xl font-mono font-bold text-orange-600">{orgoBurnAmount.toFixed(1)} ORGO</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-gray-50 to-blue-50 border-gray-200">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <DollarSign className="h-6 w-6" />PayPal
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center">
                    <div className="text-4xl font-mono font-bold text-gray-600 mb-2">{paypalTime.toFixed(0)}ms</div>
                    <Progress value={paypalProgress} className="h-3" />
                  </div>
                  <div className="bg-white/50 rounded-lg p-4">
                    <p className="text-sm text-gray-700">{paypalStatus}</p>
                  </div>
                  <div className="bg-gradient-to-r from-red-100 to-orange-100 rounded-lg p-4">
                    <div className="text-2xl font-mono font-bold text-red-600">$299.00</div>
                    <p className="text-xs text-red-700">2.99% international fee</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="vm-dashboard">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="w-6 h-6" />VM Dashboard - ORGO Computer Environment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">$1.24M</div>
                    <div className="text-sm text-gray-600">Total Volume</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">42.7K</div>
                    <div className="text-sm text-gray-600">Transactions</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">0.3s</div>
                    <div className="text-sm text-gray-600">Settlement</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">98.7%</div>
                    <div className="text-sm text-gray-600">Success Rate</div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="font-medium">Routing Optimizer</span>
                    </div>
                    <span className="text-sm text-gray-600">42 active tasks</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="font-medium">Risk Management</span>
                    </div>
                    <span className="text-sm text-gray-600">3 threats blocked</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="font-medium">Compliance Engine</span>
                    </div>
                    <span className="text-sm text-gray-600">1.2K checks today</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payment">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-6 h-6" />Send ORGO Payment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Amount (ORGO)</label>
                  <Input type="number" value={paymentAmount} onChange={(e) => setPaymentAmount(e.target.value)} placeholder="Enter amount" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Recipient Address</label>
                  <Input type="text" value={recipientAddress} onChange={(e) => setRecipientAddress(e.target.value)} placeholder="Solana wallet address" />
                </div>
                <Button onClick={handlePayment} disabled={!paymentAmount || !recipientAddress || paymentStatus === 'processing'} className="w-full bg-gradient-to-r from-blue-600 to-purple-600">
                  {paymentStatus === 'processing' ? 'Processing...' : paymentStatus === 'completed' ? 'Payment Sent!' : 'Send Payment'}
                </Button>
                {paymentStatus === 'completed' && (
                  <div className="text-center text-green-600 font-medium">✅ Payment of {paymentAmount} ORGO sent successfully!</div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="token-info">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Coins className="w-6 h-6" />ORGO Token Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">$0.0234</div>
                    <div className="text-sm text-gray-600">Price</div>
                    <div className="text-xs text-green-600">+12.5%</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">$45.6M</div>
                    <div className="text-sm text-gray-600">Market Cap</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">15.4K</div>
                    <div className="text-sm text-gray-600">Holders</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">$1.25M</div>
                    <div className="text-sm text-gray-600">24h Volume</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="wallet">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="w-6 h-4" />Wallet Balance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center p-8">
                  <div className="text-4xl font-bold text-blue-600 mb-2">1,250.75 ORGO</div>
                  <div className="text-lg text-gray-600 mb-4">≈ $29.27 USD</div>
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600">Connect Wallet</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="w-6 h-6" />Transaction History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium">ORGO Transfer</div>
                      <div className="text-sm text-gray-600">To: 7xKX...SAEv</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-red-600">-150 ORGO</div>
                      <div className="text-sm text-gray-600">5m ago</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium">ORGO Received</div>
                      <div className="text-sm text-gray-600">From: 9WzD...AWWM</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-green-600">+500 ORGO</div>
                      <div className="text-sm text-gray-600">1h ago</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="live-speed-demo">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-6 h-6" />Live Speed Demo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center p-8">
                  <div className="text-6xl font-bold text-green-600 mb-4">0.3s</div>
                  <div className="text-2xl text-gray-600 mb-6">Average Settlement Time</div>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-blue-600">10x</div>
                      <div className="text-sm">Faster</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">35x</div>
                      <div className="text-sm">Cheaper</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-purple-600">100%</div>
                      <div className="text-sm">Deflationary</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default App

