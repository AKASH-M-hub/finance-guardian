-- Initial Schema for Future Your Finance (FYF)
-- Created: 2026-01-19
-- Description: Complete database schema with tables for user profiles, financial analysis, chat, check-ins, and goals

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- PROFILES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Income Information
  monthly_income_range TEXT NOT NULL CHECK (monthly_income_range IN ('below_25k', '25k_50k', '50k_1L', 'above_1L')),
  income_type TEXT NOT NULL CHECK (income_type IN ('salary', 'student', 'freelance', 'business')),
  country TEXT NOT NULL DEFAULT 'India',
  
  -- Commitments
  commitments TEXT[] DEFAULT '{}',
  total_fixed_amount DECIMAL(12, 2) DEFAULT 0,
  
  -- Spending Behavior
  spending_style TEXT CHECK (spending_style IN ('mostly_planned', 'mixed', 'mostly_impulsive')),
  overspend_trigger TEXT CHECK (overspend_trigger IN ('late_night', 'weekends', 'stress_days', 'social_events')),
  top_impulse_category TEXT CHECK (top_impulse_category IN ('food_delivery', 'shopping', 'travel', 'entertainment', 'gadgets')),
  
  -- Emotional & Financial State
  money_feeling TEXT CHECK (money_feeling IN ('confident', 'comfortable', 'slightly_worried', 'very_stressed', 'crisis_mode')),
  reach_zero_frequency TEXT CHECK (reach_zero_frequency IN ('never', 'rarely', 'sometimes', 'often', 'always')),
  emergency_readiness TEXT CHECK (emergency_readiness IN ('fully_covered', 'can_handle', 'will_struggle', 'no_safety_net')),
  
  -- Life Context
  life_situation TEXT CHECK (life_situation IN ('none', 'job_change', 'new_city', 'wedding_planned', 'family_expansion', 'health_concern')),
  planned_purchase TEXT CHECK (planned_purchase IN ('none', 'vehicle', 'home', 'education', 'wedding', 'gadget')),
  
  -- AI Preferences
  ai_help_level TEXT CHECK (ai_help_level IN ('only_insights', 'insights_suggestions', 'auto_guardrails')),
  
  -- Onboarding Status
  is_onboarded BOOLEAN DEFAULT FALSE,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- FINANCIAL ANALYSIS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.financial_analysis (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  
  -- Core Metrics
  stress_score INTEGER NOT NULL CHECK (stress_score >= 0 AND stress_score <= 100),
  risk_level TEXT NOT NULL CHECK (risk_level IN ('safe', 'caution', 'warning', 'crisis')),
  silent_burden_index INTEGER CHECK (silent_burden_index >= 0 AND silent_burden_index <= 100),
  survival_days INTEGER DEFAULT 0,
  debt_risk INTEGER DEFAULT 0 CHECK (debt_risk >= 0 AND debt_risk <= 100),
  health_score INTEGER DEFAULT 0 CHECK (health_score >= 0 AND health_score <= 100),
  
  -- Budget Recommendations
  emergency_fund_target DECIMAL(12, 2),
  weekly_budget DECIMAL(12, 2),
  daily_budget DECIMAL(12, 2),
  
  -- Recovery Metrics
  recovery_days INTEGER,
  
  -- Analysis Metadata
  analyzed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Ensure one active analysis per user (we'll use this for current analysis)
  is_current BOOLEAN DEFAULT TRUE
);

-- Create index for faster queries
CREATE INDEX idx_financial_analysis_user_id ON public.financial_analysis(user_id);
CREATE INDEX idx_financial_analysis_current ON public.financial_analysis(user_id, is_current) WHERE is_current = TRUE;

-- =====================================================
-- ACTIVE SIGNALS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.active_signals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  analysis_id UUID NOT NULL REFERENCES public.financial_analysis(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  
  signal_id TEXT NOT NULL,
  signal_type TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  actionable TEXT,
  
  -- Status tracking
  is_acknowledged BOOLEAN DEFAULT FALSE,
  is_resolved BOOLEAN DEFAULT FALSE,
  acknowledged_at TIMESTAMPTZ,
  resolved_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_active_signals_user_id ON public.active_signals(user_id);
CREATE INDEX idx_active_signals_analysis_id ON public.active_signals(analysis_id);

-- =====================================================
-- RECOMMENDATIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.recommendations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  analysis_id UUID NOT NULL REFERENCES public.financial_analysis(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  
  recommendation_id TEXT NOT NULL,
  priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  action TEXT NOT NULL,
  category TEXT NOT NULL,
  
  -- Status tracking
  is_accepted BOOLEAN DEFAULT FALSE,
  is_completed BOOLEAN DEFAULT FALSE,
  accepted_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_recommendations_user_id ON public.recommendations(user_id);
CREATE INDEX idx_recommendations_analysis_id ON public.recommendations(analysis_id);

-- =====================================================
-- CHAT CONVERSATIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.chat_conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  
  title TEXT NOT NULL DEFAULT 'New Conversation',
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_updated TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_chat_conversations_user_id ON public.chat_conversations(user_id);

-- =====================================================
-- CHAT MESSAGES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES public.chat_conversations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  
  -- Message metadata
  message_index INTEGER NOT NULL,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_chat_messages_conversation_id ON public.chat_messages(conversation_id);
CREATE INDEX idx_chat_messages_user_id ON public.chat_messages(user_id);

-- =====================================================
-- CHECK-INS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.check_ins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  
  check_in_date DATE NOT NULL,
  mood TEXT NOT NULL CHECK (mood IN ('great', 'good', 'okay', 'stressed', 'anxious')),
  spent_today DECIMAL(10, 2) NOT NULL DEFAULT 0,
  stayed_under_budget BOOLEAN DEFAULT TRUE,
  notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Ensure one check-in per user per day
  UNIQUE(user_id, check_in_date)
);

CREATE INDEX idx_check_ins_user_id ON public.check_ins(user_id);
CREATE INDEX idx_check_ins_date ON public.check_ins(user_id, check_in_date DESC);

-- =====================================================
-- GOALS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  
  goal_type TEXT NOT NULL CHECK (goal_type IN ('emergency_fund', 'debt_payoff', 'savings', 'investment', 'purchase', 'custom')),
  title TEXT NOT NULL,
  description TEXT,
  target_amount DECIMAL(12, 2),
  current_amount DECIMAL(12, 2) DEFAULT 0,
  
  -- Timeline
  target_date DATE,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Status
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'cancelled')),
  completed_at TIMESTAMPTZ,
  
  -- Progress tracking
  progress_percentage INTEGER GENERATED ALWAYS AS (
    CASE 
      WHEN target_amount > 0 THEN LEAST(100, ROUND((current_amount / target_amount * 100)::NUMERIC, 0)::INTEGER)
      ELSE 0
    END
  ) STORED,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_goals_user_id ON public.goals(user_id);
CREATE INDEX idx_goals_status ON public.goals(user_id, status);

-- =====================================================
-- GOAL TRANSACTIONS TABLE (Track contributions to goals)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.goal_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  goal_id UUID NOT NULL REFERENCES public.goals(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  
  amount DECIMAL(12, 2) NOT NULL,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('contribution', 'withdrawal')),
  notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_goal_transactions_goal_id ON public.goal_transactions(goal_id);
CREATE INDEX idx_goal_transactions_user_id ON public.goal_transactions(user_id);

-- =====================================================
-- TRIGGERS FOR UPDATED_AT
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_financial_analysis_updated_at BEFORE UPDATE ON public.financial_analysis
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_active_signals_updated_at BEFORE UPDATE ON public.active_signals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_recommendations_updated_at BEFORE UPDATE ON public.recommendations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_check_ins_updated_at BEFORE UPDATE ON public.check_ins
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_goals_updated_at BEFORE UPDATE ON public.goals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- TRIGGER FOR CHAT CONVERSATION LAST_UPDATED
-- =====================================================
CREATE OR REPLACE FUNCTION update_conversation_last_updated()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.chat_conversations 
  SET last_updated = NOW() 
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_conversation_on_message AFTER INSERT ON public.chat_messages
  FOR EACH ROW EXECUTE FUNCTION update_conversation_last_updated();

-- =====================================================
-- TRIGGER FOR GOAL AMOUNT UPDATES
-- =====================================================
CREATE OR REPLACE FUNCTION update_goal_amount()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.transaction_type = 'contribution' THEN
    UPDATE public.goals 
    SET current_amount = current_amount + NEW.amount,
        updated_at = NOW()
    WHERE id = NEW.goal_id;
  ELSIF NEW.transaction_type = 'withdrawal' THEN
    UPDATE public.goals 
    SET current_amount = GREATEST(0, current_amount - NEW.amount),
        updated_at = NOW()
    WHERE id = NEW.goal_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_goal_on_transaction AFTER INSERT ON public.goal_transactions
  FOR EACH ROW EXECUTE FUNCTION update_goal_amount();

-- =====================================================
-- COMMENTS FOR DOCUMENTATION
-- =====================================================
COMMENT ON TABLE public.profiles IS 'User financial profiles with income, spending habits, and preferences';
COMMENT ON TABLE public.financial_analysis IS 'Financial health analysis with stress scores and recommendations';
COMMENT ON TABLE public.active_signals IS 'Active financial signals and alerts for users';
COMMENT ON TABLE public.recommendations IS 'AI-generated recommendations based on financial analysis';
COMMENT ON TABLE public.chat_conversations IS 'Chat conversation threads between users and AI coach';
COMMENT ON TABLE public.chat_messages IS 'Individual messages within chat conversations';
COMMENT ON TABLE public.check_ins IS 'Daily financial and emotional check-ins';
COMMENT ON TABLE public.goals IS 'User financial goals with progress tracking';
COMMENT ON TABLE public.goal_transactions IS 'Transaction history for goal contributions and withdrawals';
