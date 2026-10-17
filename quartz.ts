import { loadQuartzConfig, loadQuartzLayout } from "./quartz/plugins/loader/config-loader"
import LostInSpace from "./quartz/plugins/local/not-found-page"

const config = await loadQuartzConfig()
config.plugins.pageTypes = config.plugins.pageTypes?.map((pageType) =>
  pageType.name === "404" ? { ...pageType, body: LostInSpace } : pageType,
)

export default config
export const layout = await loadQuartzLayout()
