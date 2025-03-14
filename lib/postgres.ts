/*
Table Definitions: 


CREATE TABLE lingolin_events (
  id SERIAL PRIMARY KEY,
  user_id text NOT NULL,
  event_type text NOT NULL,
  extra text,
  extra2 text,
  extra3 text,
  extra4 text,
  extra5 text,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);


*/

import { Pool, PoolClient, types } from "pg"
import { postErrorToDiscord, postToDiscord } from "./discord"

// Parse numeric types as floats
types.setTypeParser(1700, function (val: any) {
  return parseFloat(val)
})

// Parse BIGINT as numbers
types.setTypeParser(20, function (val: any) {
  return parseInt(val, 10)
})

// Replace the global pool with a function to get/create pool
let pool: Pool | null = null

const getPool = (): Pool => {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.SUPABASE_DB_URL || "",
      ssl: {
        rejectUnauthorized: false,
      },
      // Add these connection pool settings
      max: 20, // Maximum number of clients
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    })

    // Handle pool errors
    pool.on("error", (err: Error) => {
      // console.error("Unexpected error on idle client", err)
      pool = null // Reset pool so new one will be created
    })
  }
  return pool
}

// Modify executeQuery to use getPool()
export const executeQuery = async <T = any>(
  query: string,
  params: Array<any> = []
): Promise<T> => {
  const pool = getPool()
  const client: PoolClient = await pool.connect()

  try {
    const res = await client.query(query, params)
    return res as T
  } catch (error: any) {
    await postErrorToDiscord(
      "Error running this sql: " + query + " with params: " + params.join(", ")
    )
    console.error("🔴🔴🔴🔴 Error executing query", error.stack)
    throw error
  } finally {
    client.release()
  }
}

process.on("SIGTERM", async () => {
  if (pool) {
    await pool.end()
    pool = null
  }
})

export const logEvent = async ({
  event_type,
  userId,
  extra,
  extra2,
  extra3,
  extra4,
  extra5,
}: {
  event_type: string
  userId: string
  extra?: string
  extra2?: string
  extra3?: string
  extra4?: string
  extra5?: string
}) => {
  const query = `INSERT INTO lingolin_events (user_id, event_type, extra, extra2, extra3, extra4, extra5) VALUES ($1, $2, $3, $4, $5, $6, $7)`
  const params = [
    userId,
    event_type,
    extra || null,
    extra2 || null,
    extra3 || null,
    extra4 || null,
    extra5 || null,
  ]
  await executeQuery(query, params)
  await postToDiscord("🥚🥚🥚🥚🥚🥚 EVENT LOGGED: " + event_type)
}

export const getRecentTranslationsByUserId = async (userId: string) => {
  const query = `SELECT id, event_type, extra, extra2, extra3, extra4, created_at
    FROM lingolin_events 
    WHERE user_id = $1 
    AND (event_type = 'translation_missed' OR event_type = 'translation_hit' or event_type = 'save_voice_note') 
    ORDER BY created_at DESC 
    LIMIT 50`
  const params = [userId]
  const res = await executeQuery(query, params)
  return res.rows
}

export const deleteTranslationFromLogsById = async (translationId: string) => {
  const query = `DELETE FROM lingolin_events WHERE id = $1`
  const params = [translationId]
  await executeQuery(query, params)
  await postToDiscord(
    "🔴🔴🔴🔴 DELETED TRANSLATION FROM LOGS: " + translationId
  )
}

export const getRecentActivity = async () => {
  const query = `SELECT * FROM lingolin_events ORDER BY created_at DESC LIMIT 50`
  const res = await executeQuery(query)
  return res.rows
}

export const getTranslatedAudioByMessageAndLanguage = async ({
  message,
  language,
}: {
  message: string
  language: string
}) => {
  const query = `SELECT * FROM lingolin_events WHERE event_type = 'tts_generated' AND extra = $1 AND extra2 = $2`
  const params = [message, language]
  const res = await executeQuery(query, params)
  return res.rows[0]
}

export const getRecentTTsByUserId = async (userId: string) => {
  const query = `SELECT * FROM lingolin_events WHERE event_type = 'tts_generated' AND user_id = $1 ORDER BY created_at DESC LIMIT 50`
  const params = [userId]
  const res = await executeQuery(query, params)
  return res.rows
}
