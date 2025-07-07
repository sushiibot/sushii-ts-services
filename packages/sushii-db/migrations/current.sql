-- Add trigger for deployment table notifications
CREATE OR REPLACE FUNCTION app_private.notify_deployment_change()
RETURNS TRIGGER AS $$
BEGIN
    -- Notify with the new deployment name as payload
    PERFORM pg_notify('deployment_changed', NEW.name);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger that fires on INSERT or UPDATE
CREATE TRIGGER deployment_change_trigger
    AFTER INSERT OR UPDATE ON app_private.active_deployment
    FOR EACH ROW
    EXECUTE FUNCTION app_private.notify_deployment_change();
