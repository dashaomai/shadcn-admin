/**
 * 按最多 2 个字符的原则，返回用于 Avatar Fullback 组件内的文字
 * @param content 要回退的原始文字
 * @returns
 */
export const getFallback = (
  content: string | undefined,
  len: number = 2
): string => {
  if (len < 1) {
    len = 1
  }

  if (content) {
    if (content.length <= len) {
      return content
    } else {
      return content.substring(0, len)
    }
  } else {
    return '?'
  }
}
