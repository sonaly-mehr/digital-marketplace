import prisma from "./db";
import { stripe } from "./stripe";


export async function checkStripeAccountStatus(connectedAccountId: string) {
  try {
    const account = await stripe.accounts.retrieve(connectedAccountId);
    
    const isActive = account.capabilities?.transfers === 'active' 
      && account.charges_enabled === true 
      && account.payouts_enabled === true;
    
    if (isActive) {
      // Update the database
      await prisma.user.update({
        where: { connectedAccountId },
        data: { stripeConnectedLinked: true }
      });
    }
    
    return isActive;
  } catch (error) {
    console.error('Error checking Stripe account:', error);
    return false;
  }
}