import { Request, Response }
from "express";

import axios from "axios";

const pool =
  require("../../config/db");

import redisClient
from "../../config/redis";

export const checkServices =
  async (
    _req: Request,
    res: Response
  ) => {

  try {

    const services = [];

    // ===================================
    // EQUITY SERVICE
    // ===================================

    const equityStart = Date.now();

    try {

      await axios.get(
        "http://localhost:4001/health"
      );

      const responseTime =
        Date.now() - equityStart;

      services.push({

        service: "EQUITY_SERVICE",

        status: "UP",

        responseTime
      });

      await pool.query(
        `
        INSERT INTO service_health_logs
        (
          service_name,
          service_status,
          response_time_ms
        )
        VALUES ($1,$2,$3)
        `,
        [
          "EQUITY_SERVICE",
          "UP",
          responseTime
        ]
      );

    } catch (error: any) {

      services.push({

        service: "EQUITY_SERVICE",

        status: "DOWN",

        error:
          error.message
      });

      await pool.query(
        `
        INSERT INTO service_health_logs
        (
          service_name,
          service_status,
          error_message
        )
        VALUES ($1,$2,$3)
        `,
        [
          "EQUITY_SERVICE",
          "DOWN",
          error.message
        ]
      );
    }

    // ===================================
    // MF SERVICE
    // ===================================

    const mfStart = Date.now();

    try {

      await axios.get(
        "http://localhost:4002/health"
      );

      const responseTime =
        Date.now() - mfStart;

      services.push({

        service: "MF_SERVICE",

        status: "UP",

        responseTime
      });

      await pool.query(
        `
        INSERT INTO service_health_logs
        (
          service_name,
          service_status,
          response_time_ms
        )
        VALUES ($1,$2,$3)
        `,
        [
          "MF_SERVICE",
          "UP",
          responseTime
        ]
      );

    } catch (error: any) {

      services.push({

        service: "MF_SERVICE",

        status: "DOWN",

        error:
          error.message
      });

      await pool.query(
        `
        INSERT INTO service_health_logs
        (
          service_name,
          service_status,
          error_message
        )
        VALUES ($1,$2,$3)
        `,
        [
          "MF_SERVICE",
          "DOWN",
          error.message
        ]
      );
    }

    // ===================================
    // REDIS
    // ===================================

    try {

      await redisClient.ping();

      services.push({

        service: "REDIS",

        status: "UP"
      });

    } catch (error: any) {

      services.push({

        service: "REDIS",

        status: "DOWN",

        error:
          error.message
      });
    }

    // ===================================
    // POSTGRES
    // ===================================

    try {

      await pool.query(
        "SELECT NOW()"
      );

      services.push({

        service: "POSTGRES",

        status: "UP"
      });

    } catch (error: any) {

      services.push({

        service: "POSTGRES",

        status: "DOWN",

        error:
          error.message
      });
    }

    // ===================================
    // RESPONSE
    // ===================================

    res.status(200).json({

      success: true,

      checkedAt:
        new Date(),

      services
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({

      success: false,

      message:
        "Internal server error"
    });
  }
};