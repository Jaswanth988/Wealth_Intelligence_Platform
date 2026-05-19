const pool = require("../config/db");

interface AuditLogPayload {

  userId?: string;

  action: string;

  entityType?: string;

  entityId?: string;

  oldValues?: any;

  newValues?: any;

  ipAddress?: string;
}

export const createAuditLog = async (
  payload: AuditLogPayload
) => {

  try {

    await pool.query(
      `
      INSERT INTO audit_logs
      (
        user_id,
        action,
        entity_type,
        entity_id,
        old_values,
        new_values,
        ip_address
      )
      VALUES
      ($1,$2,$3,$4,$5,$6,$7)
      `,
      [
        payload.userId || null,

        payload.action,

        payload.entityType || null,

        payload.entityId || null,

        payload.oldValues || null,

        payload.newValues || null,

        payload.ipAddress || null
      ]
    );

  } catch (error) {

    console.log(
      "Audit Log Error:",
      error
    );
  }
};