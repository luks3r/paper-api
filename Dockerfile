FROM oven/bun:latest
COPY . .
RUN bun install
EXPOSE 3030
CMD ["bun", "run", "start"]
