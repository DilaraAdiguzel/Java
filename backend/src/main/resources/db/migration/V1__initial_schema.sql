CREATE TABLE app_users (
    id UUID PRIMARY KEY,
    email VARCHAR(320) NOT NULL UNIQUE,
    full_name VARCHAR(120) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE workspaces (
    id UUID PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE workspace_members (
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL DEFAULT 'MEMBER',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (workspace_id, user_id),
    CONSTRAINT chk_workspace_member_role CHECK (role IN ('OWNER', 'ADMIN', 'MEMBER'))
);

CREATE TABLE vendors (
    id UUID PRIMARY KEY,
    canonical_name VARCHAR(120) NOT NULL UNIQUE,
    website VARCHAR(2048),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE subscriptions (
    id UUID PRIMARY KEY,
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    vendor_id UUID NOT NULL REFERENCES vendors(id),
    category VARCHAR(30) NOT NULL,
    amount NUMERIC(19, 4) NOT NULL,
    currency CHAR(3) NOT NULL,
    billing_cycle VARCHAR(20) NOT NULL,
    first_payment_date DATE NOT NULL,
    next_renewal_date DATE,
    owner_name VARCHAR(120) NOT NULL,
    team_name VARCHAR(120),
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    notes VARCHAR(500),
    recurrence_confidence SMALLINT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_subscription_category CHECK (category IN ('INFRASTRUCTURE', 'ENGINEERING', 'PRODUCTIVITY', 'MARKETING', 'FINANCE', 'OTHER')),
    CONSTRAINT chk_subscription_amount CHECK (amount > 0),
    CONSTRAINT chk_subscription_currency CHECK (currency ~ '^[A-Z]{3}$'),
    CONSTRAINT chk_subscription_cycle CHECK (billing_cycle IN ('MONTHLY', 'YEARLY')),
    CONSTRAINT chk_subscription_status CHECK (status IN ('ACTIVE', 'TRIAL', 'CANCELLED')),
    CONSTRAINT chk_recurrence_confidence CHECK (recurrence_confidence BETWEEN 0 AND 100)
);

CREATE INDEX idx_subscriptions_workspace_status ON subscriptions (workspace_id, status);
CREATE INDEX idx_subscriptions_next_renewal ON subscriptions (next_renewal_date) WHERE status = 'ACTIVE';

CREATE TABLE transactions (
    id UUID PRIMARY KEY,
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    vendor_id UUID REFERENCES vendors(id),
    subscription_id UUID REFERENCES subscriptions(id) ON DELETE SET NULL,
    source_hash CHAR(64) NOT NULL,
    transaction_date DATE NOT NULL,
    description VARCHAR(500) NOT NULL,
    amount NUMERIC(19, 4) NOT NULL,
    currency CHAR(3) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_transactions_workspace_source_hash UNIQUE (workspace_id, source_hash),
    CONSTRAINT chk_transaction_amount CHECK (amount > 0),
    CONSTRAINT chk_transaction_currency CHECK (currency ~ '^[A-Z]{3}$')
);

CREATE INDEX idx_transactions_workspace_date ON transactions (workspace_id, transaction_date DESC);
CREATE INDEX idx_transactions_vendor_date ON transactions (vendor_id, transaction_date DESC);

CREATE TABLE alerts (
    id UUID PRIMARY KEY,
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    subscription_id UUID REFERENCES subscriptions(id) ON DELETE SET NULL,
    type VARCHAR(30) NOT NULL,
    severity VARCHAR(20) NOT NULL,
    title VARCHAR(160) NOT NULL,
    description VARCHAR(1000) NOT NULL,
    impact_monthly NUMERIC(19, 4),
    detected_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMPTZ,
    deduplication_key VARCHAR(255) NOT NULL UNIQUE,
    CONSTRAINT chk_alert_type CHECK (type IN ('PRICE_INCREASE', 'POSSIBLE_DUPLICATE', 'USAGE_REVIEW', 'RENEWAL', 'SAVINGS')),
    CONSTRAINT chk_alert_severity CHECK (severity IN ('CRITICAL', 'WARNING', 'OPPORTUNITY', 'INFO')),
    CONSTRAINT chk_alert_impact CHECK (impact_monthly IS NULL OR impact_monthly >= 0)
);

CREATE INDEX idx_alerts_workspace_unresolved ON alerts (workspace_id, detected_at DESC) WHERE resolved_at IS NULL;
