// MongoDB连接（可选依赖）
let MongoClient = null;
const DB_NAME = 'ai-cmd';
const COLLECTION_NAME = 'history';
const MONGO_URI = 'mongodb://localhost:27017';

async function createDbClient() {
  // 动态导入mongodb，如果未安装则跳过
  if (!MongoClient) {
    const mongodb = await import('mongodb');
    MongoClient = mongodb.MongoClient;
  }

  const client = new MongoClient(MONGO_URI, {
    // 避免本地未启动 MongoDB 时 CLI 长时间等待
    serverSelectionTimeoutMS: 1500,
  });
  await client.connect();
  return { client, db: client.db(DB_NAME) };
}

async function insertHistoryEntry(entry) {
  let client = null;
  try {
    const conn = await createDbClient();
    client = conn.client;
    const collection = conn.db.collection(COLLECTION_NAME);
    await collection.insertOne({
      ...entry,
      timestamp: entry.timestamp || new Date(),
    });
  } catch (error) {
    // 静默失败，不影响主流程
  } finally {
    if (client) {
      try {
        await client.close();
      } catch (closeErr) {
        // 忽略关闭失败
      }
    }
  }
}

// 保存翻译历史（供CLI调用）
export async function saveHistory(text, result, config) {
  await insertHistoryEntry({
    type: 'translation',
    text,
    result,
    provider: config.provider || 'libre',
    from: config.from || 'auto',
    to: config.to || 'zh',
  });
}

// 保存问答历史（供CLI与Web调用）
export async function saveAskHistory(question, answer, config) {
  await insertHistoryEntry({
    type: 'qa',
    question,
    answer,
    // 同时保存 text/result 兼容旧展示逻辑
    text: question,
    result: answer,
    provider: config.provider || 'deepseek',
  });
}
