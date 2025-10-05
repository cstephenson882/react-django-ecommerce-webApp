
import Header from './components/Header'
import Footer from './components/Footer'
import HomeScreen from './screens/HomeScreen'
import ProductScreen from './screens/ProductScreen'
import CartScreen from './screens/CartScreen'
import LoginScreen from './screens/LoginScreen'
import RegisterScreen from './screens/RegisterScreen'
import ProfileScreen from './screens/ProfileScreen'
// ShippingScreen
import ShippingScreen from './screens/ShippingScreen'
// PaymentScreen
import PaymentScreen from './screens/PaymentScreen'
// PlaceOrderScreen
import PlaceOrderScreen from './screens/PlaceOrderScreen'
import OrderScreen from './screens/OrderScreen'

import OrderListScreen from './screens/OrderListScreen' 

import UserListScreen from './screens/UserListScreen'

import UserEditScreen from './screens/UserEditScreen'

import ProductListScreen from './screens/ProductListScreen'

import ProductEditScreen from './screens/ProductEditScreen'


import { BrowserRouter as Router, Route, Routes} from 'react-router-dom'


function App() {
  return (
    
     <Router>
      <Header />

      <main>
        <section className='p-5'>
          <div  className="container">
            <h1 className="visually-hidden">Welcome to ProShop</h1>
            <Routes> 
              <Route path="/" element={<HomeScreen />} exact />
              <Route path="/product/:id" element={<ProductScreen />}  />
              <Route path="/cart/:id?" element={<CartScreen />} /> 
              <Route path="/login" element={<LoginScreen />} /> 
              <Route path="/register" element={<RegisterScreen />} /> 
              <Route path="/profile" element={<ProfileScreen/>}/> 
              
              <Route path="/shipping" element={<ShippingScreen />} />
              <Route path="/payment" element={<PaymentScreen />} />
              <Route path="/placeorder" element={<PlaceOrderScreen />} />
              
              <Route path="/admin/orderlist" element={<OrderListScreen />} />
              <Route path="/order/:id" element={<OrderScreen />} />

              <Route path="/admin/userlist" element={<UserListScreen />} />
              <Route path="/admin/user/:id/edit" element={<UserEditScreen />} />
              {/* route for productslist */}
              <Route path="/admin/productlist" element={<ProductListScreen />} />

              <Route path="/admin/product/:productID/edit" element={<ProductEditScreen />} />
              
              {/* 404 page */}
               
            </Routes>
            
          </div>
        </section>
      </main>

      <Footer />
    
    </Router>
  );
}

export default App;
