import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface PaymentContextType {
  hasPaid: boolean;
  isLoading: boolean;
  checkPaymentStatus: () => Promise<void>;
  createPayment: (amount: number, paymentMethod: string) => Promise<{ success: boolean; url?: string }>;
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (context === undefined) {
    throw new Error('usePayment must be used within a PaymentProvider');
  }
  return context;
};

export const PaymentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hasPaid, setHasPaid] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkPaymentStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setHasPaid(false);
        setIsLoading(false);
        return;
      }

      const { data: payments, error } = await supabase
        .from('payments')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'paid')
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Error checking payment status:', error);
      }

      setHasPaid(!!payments);
    } catch (error) {
      console.error('Error checking payment status:', error);
      setHasPaid(false);
    } finally {
      setIsLoading(false);
    }
  };

  const createPayment = async (amount: number, paymentMethod: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { success: false };
      }

      // Criar registro de pagamento pendente
      const { data: payment, error: createError } = await supabase
        .from('payments')
        .insert({
          user_id: user.id,
          amount: amount,
          payment_method: paymentMethod,
          status: 'pending'
        })
        .select()
        .single();

      if (createError) {
        console.error('Error creating payment:', createError);
        return { success: false };
      }

      // Aqui você integraria com seu gateway de pagamento
      // Exemplo: Stripe, PagSeguro, Mercado Pago, etc.
      
      // Para este exemplo, vamos simular uma redireção para um checkout externo
      const checkoutUrl = `https://seu-gateway-de-pagamento.com/checkout?payment_id=${payment.id}&amount=${amount}&user_id=${user.id}`;
      
      return { success: true, url: checkoutUrl };
    } catch (error) {
      console.error('Error creating payment:', error);
      return { success: false };
    }
  };

  useEffect(() => {
    checkPaymentStatus();
  }, []);

  const value = {
    hasPaid,
    isLoading,
    checkPaymentStatus,
    createPayment,
  };

  return <PaymentContext.Provider value={value}>{children}</PaymentContext.Provider>;
};