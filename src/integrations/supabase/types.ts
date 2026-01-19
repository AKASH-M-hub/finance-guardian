export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string | null
          monthly_income_range: 'below_25k' | '25k_50k' | '50k_1L' | 'above_1L'
          income_type: 'salary' | 'student' | 'freelance' | 'business'
          country: string
          commitments: string[]
          total_fixed_amount: number
          spending_style: 'mostly_planned' | 'mixed' | 'mostly_impulsive' | null
          overspend_trigger: 'late_night' | 'weekends' | 'stress_days' | 'social_events' | null
          top_impulse_category: 'food_delivery' | 'shopping' | 'travel' | 'entertainment' | 'gadgets' | null
          money_feeling: 'confident' | 'comfortable' | 'slightly_worried' | 'very_stressed' | 'crisis_mode' | null
          reach_zero_frequency: 'never' | 'rarely' | 'sometimes' | 'often' | 'always' | null
          emergency_readiness: 'fully_covered' | 'can_handle' | 'will_struggle' | 'no_safety_net' | null
          life_situation: 'none' | 'job_change' | 'new_city' | 'wedding_planned' | 'family_expansion' | 'health_concern' | null
          planned_purchase: 'none' | 'vehicle' | 'home' | 'education' | 'wedding' | 'gadget' | null
          ai_help_level: 'only_insights' | 'insights_suggestions' | 'auto_guardrails' | null
          is_onboarded: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email?: string | null
          monthly_income_range: 'below_25k' | '25k_50k' | '50k_1L' | 'above_1L'
          income_type: 'salary' | 'student' | 'freelance' | 'business'
          country?: string
          commitments?: string[]
          total_fixed_amount?: number
          spending_style?: 'mostly_planned' | 'mixed' | 'mostly_impulsive' | null
          overspend_trigger?: 'late_night' | 'weekends' | 'stress_days' | 'social_events' | null
          top_impulse_category?: 'food_delivery' | 'shopping' | 'travel' | 'entertainment' | 'gadgets' | null
          money_feeling?: 'confident' | 'comfortable' | 'slightly_worried' | 'very_stressed' | 'crisis_mode' | null
          reach_zero_frequency?: 'never' | 'rarely' | 'sometimes' | 'often' | 'always' | null
          emergency_readiness?: 'fully_covered' | 'can_handle' | 'will_struggle' | 'no_safety_net' | null
          life_situation?: 'none' | 'job_change' | 'new_city' | 'wedding_planned' | 'family_expansion' | 'health_concern' | null
          planned_purchase?: 'none' | 'vehicle' | 'home' | 'education' | 'wedding' | 'gadget' | null
          ai_help_level?: 'only_insights' | 'insights_suggestions' | 'auto_guardrails' | null
          is_onboarded?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          monthly_income_range?: 'below_25k' | '25k_50k' | '50k_1L' | 'above_1L'
          income_type?: 'salary' | 'student' | 'freelance' | 'business'
          country?: string
          commitments?: string[]
          total_fixed_amount?: number
          spending_style?: 'mostly_planned' | 'mixed' | 'mostly_impulsive' | null
          overspend_trigger?: 'late_night' | 'weekends' | 'stress_days' | 'social_events' | null
          top_impulse_category?: 'food_delivery' | 'shopping' | 'travel' | 'entertainment' | 'gadgets' | null
          money_feeling?: 'confident' | 'comfortable' | 'slightly_worried' | 'very_stressed' | 'crisis_mode' | null
          reach_zero_frequency?: 'never' | 'rarely' | 'sometimes' | 'often' | 'always' | null
          emergency_readiness?: 'fully_covered' | 'can_handle' | 'will_struggle' | 'no_safety_net' | null
          life_situation?: 'none' | 'job_change' | 'new_city' | 'wedding_planned' | 'family_expansion' | 'health_concern' | null
          planned_purchase?: 'none' | 'vehicle' | 'home' | 'education' | 'wedding' | 'gadget' | null
          ai_help_level?: 'only_insights' | 'insights_suggestions' | 'auto_guardrails' | null
          is_onboarded?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      financial_analysis: {
        Row: {
          id: string
          user_id: string
          stress_score: number
          risk_level: 'safe' | 'caution' | 'warning' | 'crisis'
          silent_burden_index: number | null
          survival_days: number
          debt_risk: number
          health_score: number
          emergency_fund_target: number | null
          weekly_budget: number | null
          daily_budget: number | null
          recovery_days: number | null
          analyzed_at: string
          is_current: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          stress_score: number
          risk_level: 'safe' | 'caution' | 'warning' | 'crisis'
          silent_burden_index?: number | null
          survival_days?: number
          debt_risk?: number
          health_score?: number
          emergency_fund_target?: number | null
          weekly_budget?: number | null
          daily_budget?: number | null
          recovery_days?: number | null
          analyzed_at?: string
          is_current?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          stress_score?: number
          risk_level?: 'safe' | 'caution' | 'warning' | 'crisis'
          silent_burden_index?: number | null
          survival_days?: number
          debt_risk?: number
          health_score?: number
          emergency_fund_target?: number | null
          weekly_budget?: number | null
          daily_budget?: number | null
          recovery_days?: number | null
          analyzed_at?: string
          is_current?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      active_signals: {
        Row: {
          id: string
          analysis_id: string
          user_id: string
          signal_id: string
          signal_type: string
          severity: 'low' | 'medium' | 'high' | 'critical'
          title: string
          description: string
          actionable: string | null
          is_acknowledged: boolean
          is_resolved: boolean
          acknowledged_at: string | null
          resolved_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          analysis_id: string
          user_id: string
          signal_id: string
          signal_type: string
          severity: 'low' | 'medium' | 'high' | 'critical'
          title: string
          description: string
          actionable?: string | null
          is_acknowledged?: boolean
          is_resolved?: boolean
          acknowledged_at?: string | null
          resolved_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          analysis_id?: string
          user_id?: string
          signal_id?: string
          signal_type?: string
          severity?: 'low' | 'medium' | 'high' | 'critical'
          title?: string
          description?: string
          actionable?: string | null
          is_acknowledged?: boolean
          is_resolved?: boolean
          acknowledged_at?: string | null
          resolved_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      recommendations: {
        Row: {
          id: string
          analysis_id: string
          user_id: string
          recommendation_id: string
          priority: 'low' | 'medium' | 'high' | 'critical'
          title: string
          description: string
          action: string
          category: string
          is_accepted: boolean
          is_completed: boolean
          accepted_at: string | null
          completed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          analysis_id: string
          user_id: string
          recommendation_id: string
          priority: 'low' | 'medium' | 'high' | 'critical'
          title: string
          description: string
          action: string
          category: string
          is_accepted?: boolean
          is_completed?: boolean
          accepted_at?: string | null
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          analysis_id?: string
          user_id?: string
          recommendation_id?: string
          priority?: 'low' | 'medium' | 'high' | 'critical'
          title?: string
          description?: string
          action?: string
          category?: string
          is_accepted?: boolean
          is_completed?: boolean
          accepted_at?: string | null
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      chat_conversations: {
        Row: {
          id: string
          user_id: string
          title: string
          created_at: string
          last_updated: string
        }
        Insert: {
          id?: string
          user_id: string
          title?: string
          created_at?: string
          last_updated?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          created_at?: string
          last_updated?: string
        }
      }
      chat_messages: {
        Row: {
          id: string
          conversation_id: string
          user_id: string
          role: 'user' | 'assistant' | 'system'
          content: string
          message_index: number
          created_at: string
        }
        Insert: {
          id?: string
          conversation_id: string
          user_id: string
          role: 'user' | 'assistant' | 'system'
          content: string
          message_index: number
          created_at?: string
        }
        Update: {
          id?: string
          conversation_id?: string
          user_id?: string
          role?: 'user' | 'assistant' | 'system'
          content?: string
          message_index?: number
          created_at?: string
        }
      }
      check_ins: {
        Row: {
          id: string
          user_id: string
          check_in_date: string
          mood: 'great' | 'good' | 'okay' | 'stressed' | 'anxious'
          spent_today: number
          stayed_under_budget: boolean
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          check_in_date: string
          mood: 'great' | 'good' | 'okay' | 'stressed' | 'anxious'
          spent_today?: number
          stayed_under_budget?: boolean
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          check_in_date?: string
          mood?: 'great' | 'good' | 'okay' | 'stressed' | 'anxious'
          spent_today?: number
          stayed_under_budget?: boolean
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      goals: {
        Row: {
          id: string
          user_id: string
          goal_type: 'emergency_fund' | 'debt_payoff' | 'savings' | 'investment' | 'purchase' | 'custom'
          title: string
          description: string | null
          target_amount: number | null
          current_amount: number
          target_date: string | null
          started_at: string
          status: 'active' | 'paused' | 'completed' | 'cancelled'
          completed_at: string | null
          progress_percentage: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          goal_type: 'emergency_fund' | 'debt_payoff' | 'savings' | 'investment' | 'purchase' | 'custom'
          title: string
          description?: string | null
          target_amount?: number | null
          current_amount?: number
          target_date?: string | null
          started_at?: string
          status?: 'active' | 'paused' | 'completed' | 'cancelled'
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          goal_type?: 'emergency_fund' | 'debt_payoff' | 'savings' | 'investment' | 'purchase' | 'custom'
          title?: string
          description?: string | null
          target_amount?: number | null
          current_amount?: number
          target_date?: string | null
          started_at?: string
          status?: 'active' | 'paused' | 'completed' | 'cancelled'
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      goal_transactions: {
        Row: {
          id: string
          goal_id: string
          user_id: string
          amount: number
          transaction_type: 'contribution' | 'withdrawal'
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          goal_id: string
          user_id: string
          amount: number
          transaction_type: 'contribution' | 'withdrawal'
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          goal_id?: string
          user_id?: string
          amount?: number
          transaction_type?: 'contribution' | 'withdrawal'
          notes?: string | null
          created_at?: string
        }
      }
      user_registrations: {
        Row: {
          id: string
          user_id: string
          email: string
          registration_date: string
          registration_source: string
          ip_address: string | null
          user_agent: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          email: string
          registration_date?: string
          registration_source?: string
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          email?: string
          registration_date?: string
          registration_source?: string
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_current_analysis: {
        Args: { p_user_id: string }
        Returns: {
          id: string
          stress_score: number
          risk_level: string
          silent_burden_index: number
          survival_days: number
          debt_risk: number
          health_score: number
          emergency_fund_target: number
          weekly_budget: number
          daily_budget: number
          recovery_days: number
        }[]
      }
      get_active_signals_count: {
        Args: { p_user_id: string }
        Returns: number
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type PublicSchema = Database["public"]

export type Tables<
  PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] & PublicSchema["Views"]) | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends { Row: infer R }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    ? (PublicSchema["Tables"] & PublicSchema["Views"])[PublicTableNameOrOptions] extends { Row: infer R }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends keyof PublicSchema["Tables"] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends { Insert: infer I }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends { Insert: infer I }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends keyof PublicSchema["Tables"] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends { Update: infer U }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends { Update: infer U }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends keyof PublicSchema["Enums"] | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

