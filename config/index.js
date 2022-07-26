require('dotenv').config()

const CONFIG = {}

CONFIG.app = process.env.APP || 'dev'
CONFIG.port = process.env.PORT || '3000'

CONFIG.db_dialect = process.env.DB_DIALECT || 'mysql'
CONFIG.db_host = process.env.DB_HOST || 'localhost'
CONFIG.db_port = process.env.DB_PORT || '3306'
CONFIG.db_name = process.env.DB_NAME || 'vmr'
CONFIG.db_user = process.env.DB_USER || 'vmr_user'
CONFIG.db_password = process.env.DB_PASSWORD || 'M1a4$1t4E8r0'

module.exports = CONFIG
