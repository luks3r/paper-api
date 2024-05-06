FROM oven/bun:latest
COPY . .
RUN bun install
EXPOSE 8080
CMD ["bun", "run", "start"]
