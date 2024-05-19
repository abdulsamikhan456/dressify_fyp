import React from "react";
import { UserProvider } from "./UserContext";
import AppNavigation from "./navigation/appNavigation";

import { StripeProvider } from "@stripe/stripe-react-native";

const STRIPE_KEY =
  'pk_test_51OxZRgSGPT6HZUZpIZJO7K3oUd24CuVQYfMj920WV6roG4zONkqVX43ySawz2bRvMWqo4rWowmjwqDbtQfLAT0Nf00EkLRsG5n';
  

const App = () => {
  return (
    <UserProvider>
      
        <StripeProvider publishableKey={STRIPE_KEY}>
          <AppNavigation />
        </StripeProvider>
      
    </UserProvider>
  );
};

export default App;
