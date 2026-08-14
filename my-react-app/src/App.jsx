import { Route, Routes } from 'react-router-dom'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import { AdminRoute, ProtectedRoute } from './components/ProtectedRoute'
import AdminUsers from './pages/AdminUsers'
import ConfirmStay from './pages/ConfirmStay'
import Home from './pages/Home'
import HostBookings from './pages/HostBookings'
import HostDashboard from './pages/HostDashboard'
import { CreateListing, EditListing } from './pages/ListingForm'
import ListingDetail from './pages/ListingDetail'
import Login from './pages/Login'
import MyTrips from './pages/MyTrips'
import NotFound from './pages/NotFound'
import PaymentCancel from './pages/PaymentCancel'
import PaymentSuccess from './pages/PaymentSuccess'
import Profile from './pages/Profile'
import Register from './pages/Register'
import SearchResults from './pages/SearchResults'
import './App.css'

const App = () => (
  <div className="app">
    <Navbar />
    <main>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/listings/:id" element={<ListingDetail />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/payments/success" element={<PaymentSuccess />} />
        <Route path="/payments/cancel" element={<PaymentCancel />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/trips" element={<MyTrips />} />
          <Route path="/confirm/:bookingId" element={<ConfirmStay />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/host/dashboard" element={<HostDashboard />} />
          <Route path="/host/bookings" element={<HostBookings />} />
          <Route path="/host/listings/new" element={<CreateListing />} />
            <Route path="/host/listings/:id/edit" element={<EditListing />} />
          </Route>
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminUsers />} />
          </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </main>
    <Footer />
  </div>
)

export default App
