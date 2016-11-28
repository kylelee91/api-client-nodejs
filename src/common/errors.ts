export interface ErrorResource {
    status?: number;
    code?: ErrorCode;
    title?: string;
    detail?: string;
    source?: string;
}

export interface OAuthError {
    error: string;
    error_description: string;
}

export type ErrorCode =
"0.network_error" |
"400.invalid_syntax" |
"402.method_expired" | 
"402.not_ready" |
"402.payment_due" | 
"401.auth_corrupt" |
"401.auth_invalid" |
"401.auth_expired" |
"403.permissions" |
"403.restricted_portal" |
"403.must_verify" |
"403.trial_limitation" |
"403.team_mismatch" | 
"403.wrong_scope" | 
"403.tier_feature" |
"403.primary_method_deletion" |
"403.resource_capacity" |
"404.department" | 
"404.support_ticket" |
"404.support_ticket.priority" |
"404.tier" | 
"404.account" | 
"404.team" | 
"404.dns_zone" | 
"404.dns_record" | 
"404.repo" | 
"404.container" | 
"404.plan" | 
"404.instance" | 
"404.payment_method" |
"404.invoice" | 
"404.image" | 
"404.notification" | 
"404.promo_code" | 
"404.environment" |
"422.missing_argument" | 
"422.invalid_argument" |  // url
"422.invalid_input" | // body, post etc
"422.not_compatible" | 
"422.already_exists" | 
"422.limit_reached" | 
"500.unknown" | 
"500.database" | 
"500.email" |  // sendgrid 
"500.jobd" | 
"500.job_blocks" | 
"500.meta" | 
"500.image_state" | 
"500.support_activity";
