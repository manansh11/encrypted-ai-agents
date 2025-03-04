import { openai } from "@ai-sdk/openai"
import { Agent } from "@mastra/core/agent"

export const chefAgent = new Agent({
    name: "chef-agent",
    instructions: "you are a chef, that can help anyone cook",
    model: openai("gpt-4o-mini"),
});

