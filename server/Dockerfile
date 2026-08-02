FROM node:22-bookworm-slim

WORKDIR /app

ENV NODE_ENV=production \
    PORT=13250 \
    RATING_DB=/var/lib/scriverse-llm-racing/ratings.sqlite \
    CATALOG_SYNC_INTERVAL_MS=600000

RUN mkdir -p /var/lib/scriverse-llm-racing \
    && chown -R node:node /var/lib/scriverse-llm-racing

COPY --chown=node:node server.mjs rating-catalog.json ./

USER node

EXPOSE 13250

VOLUME ["/var/lib/scriverse-llm-racing"]

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD ["node", "-e", "fetch('http://127.0.0.1:' + (process.env.PORT || 13250) + '/api/rating-config').then((response) => process.exit(response.ok ? 0 : 1)).catch(() => process.exit(1))"]

CMD ["node", "server.mjs"]
