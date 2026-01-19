-- Row Level Security (RLS) Policies
-- Created: 2026-01-19
-- Description: Security policies ensuring users can only access their own data

-- =====================================================
-- ENABLE RLS ON ALL TABLES
-- =====================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.active_signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.check_ins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goal_transactions ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- PROFILES POLICIES
-- =====================================================

-- Users can view their own profile
CREATE POLICY "Users can view own profile" 
  ON public.profiles FOR SELECT 
  USING (auth.uid() = id);

-- Users can insert their own profile (during onboarding)
CREATE POLICY "Users can insert own profile" 
  ON public.profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Users can delete their own profile
CREATE POLICY "Users can delete own profile" 
  ON public.profiles FOR DELETE 
  USING (auth.uid() = id);

-- =====================================================
-- FINANCIAL ANALYSIS POLICIES
-- =====================================================

-- Users can view their own analysis
CREATE POLICY "Users can view own analysis" 
  ON public.financial_analysis FOR SELECT 
  USING (auth.uid() = user_id);

-- Users can insert their own analysis
CREATE POLICY "Users can insert own analysis" 
  ON public.financial_analysis FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own analysis
CREATE POLICY "Users can update own analysis" 
  ON public.financial_analysis FOR UPDATE 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own analysis
CREATE POLICY "Users can delete own analysis" 
  ON public.financial_analysis FOR DELETE 
  USING (auth.uid() = user_id);

-- =====================================================
-- ACTIVE SIGNALS POLICIES
-- =====================================================

-- Users can view their own signals
CREATE POLICY "Users can view own signals" 
  ON public.active_signals FOR SELECT 
  USING (auth.uid() = user_id);

-- Users can insert their own signals
CREATE POLICY "Users can insert own signals" 
  ON public.active_signals FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own signals (acknowledge/resolve)
CREATE POLICY "Users can update own signals" 
  ON public.active_signals FOR UPDATE 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own signals
CREATE POLICY "Users can delete own signals" 
  ON public.active_signals FOR DELETE 
  USING (auth.uid() = user_id);

-- =====================================================
-- RECOMMENDATIONS POLICIES
-- =====================================================

-- Users can view their own recommendations
CREATE POLICY "Users can view own recommendations" 
  ON public.recommendations FOR SELECT 
  USING (auth.uid() = user_id);

-- Users can insert their own recommendations
CREATE POLICY "Users can insert own recommendations" 
  ON public.recommendations FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own recommendations (accept/complete)
CREATE POLICY "Users can update own recommendations" 
  ON public.recommendations FOR UPDATE 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own recommendations
CREATE POLICY "Users can delete own recommendations" 
  ON public.recommendations FOR DELETE 
  USING (auth.uid() = user_id);

-- =====================================================
-- CHAT CONVERSATIONS POLICIES
-- =====================================================

-- Users can view their own conversations
CREATE POLICY "Users can view own conversations" 
  ON public.chat_conversations FOR SELECT 
  USING (auth.uid() = user_id);

-- Users can create their own conversations
CREATE POLICY "Users can create own conversations" 
  ON public.chat_conversations FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own conversations
CREATE POLICY "Users can update own conversations" 
  ON public.chat_conversations FOR UPDATE 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own conversations
CREATE POLICY "Users can delete own conversations" 
  ON public.chat_conversations FOR DELETE 
  USING (auth.uid() = user_id);

-- =====================================================
-- CHAT MESSAGES POLICIES
-- =====================================================

-- Users can view their own messages
CREATE POLICY "Users can view own messages" 
  ON public.chat_messages FOR SELECT 
  USING (auth.uid() = user_id);

-- Users can create their own messages
CREATE POLICY "Users can create own messages" 
  ON public.chat_messages FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own messages
CREATE POLICY "Users can update own messages" 
  ON public.chat_messages FOR UPDATE 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own messages
CREATE POLICY "Users can delete own messages" 
  ON public.chat_messages FOR DELETE 
  USING (auth.uid() = user_id);

-- =====================================================
-- CHECK-INS POLICIES
-- =====================================================

-- Users can view their own check-ins
CREATE POLICY "Users can view own check-ins" 
  ON public.check_ins FOR SELECT 
  USING (auth.uid() = user_id);

-- Users can create their own check-ins
CREATE POLICY "Users can create own check-ins" 
  ON public.check_ins FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own check-ins
CREATE POLICY "Users can update own check-ins" 
  ON public.check_ins FOR UPDATE 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own check-ins
CREATE POLICY "Users can delete own check-ins" 
  ON public.check_ins FOR DELETE 
  USING (auth.uid() = user_id);

-- =====================================================
-- GOALS POLICIES
-- =====================================================

-- Users can view their own goals
CREATE POLICY "Users can view own goals" 
  ON public.goals FOR SELECT 
  USING (auth.uid() = user_id);

-- Users can create their own goals
CREATE POLICY "Users can create own goals" 
  ON public.goals FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own goals
CREATE POLICY "Users can update own goals" 
  ON public.goals FOR UPDATE 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own goals
CREATE POLICY "Users can delete own goals" 
  ON public.goals FOR DELETE 
  USING (auth.uid() = user_id);

-- =====================================================
-- GOAL TRANSACTIONS POLICIES
-- =====================================================

-- Users can view their own goal transactions
CREATE POLICY "Users can view own goal transactions" 
  ON public.goal_transactions FOR SELECT 
  USING (auth.uid() = user_id);

-- Users can create their own goal transactions
CREATE POLICY "Users can create own goal transactions" 
  ON public.goal_transactions FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own goal transactions
CREATE POLICY "Users can update own goal transactions" 
  ON public.goal_transactions FOR UPDATE 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own goal transactions
CREATE POLICY "Users can delete own goal transactions" 
  ON public.goal_transactions FOR DELETE 
  USING (auth.uid() = user_id);

-- =====================================================
-- HELPER FUNCTION: Get user's current analysis
-- =====================================================
CREATE OR REPLACE FUNCTION get_current_analysis(p_user_id UUID)
RETURNS TABLE (
  id UUID,
  stress_score INTEGER,
  risk_level TEXT,
  silent_burden_index INTEGER,
  survival_days INTEGER,
  debt_risk INTEGER,
  health_score INTEGER,
  emergency_fund_target DECIMAL,
  weekly_budget DECIMAL,
  daily_budget DECIMAL,
  recovery_days INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    fa.id,
    fa.stress_score,
    fa.risk_level,
    fa.silent_burden_index,
    fa.survival_days,
    fa.debt_risk,
    fa.health_score,
    fa.emergency_fund_target,
    fa.weekly_budget,
    fa.daily_budget,
    fa.recovery_days
  FROM public.financial_analysis fa
  WHERE fa.user_id = p_user_id AND fa.is_current = TRUE
  ORDER BY fa.analyzed_at DESC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- HELPER FUNCTION: Get user's active signals count
-- =====================================================
CREATE OR REPLACE FUNCTION get_active_signals_count(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  signal_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO signal_count
  FROM public.active_signals
  WHERE user_id = p_user_id 
    AND is_resolved = FALSE;
  
  RETURN signal_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- COMMENTS
-- =====================================================
COMMENT ON POLICY "Users can view own profile" ON public.profiles IS 'Allow users to view their own profile data';
COMMENT ON POLICY "Users can view own analysis" ON public.financial_analysis IS 'Allow users to view their own financial analysis';
COMMENT ON POLICY "Users can view own conversations" ON public.chat_conversations IS 'Allow users to view their own chat conversations';
