import { fetch } from '@tauri-apps/plugin-http'
import { getAuthHeaders } from './getAuthHeaders.ts'
import { ContentId } from '../getContentId.ts'
import { getAuthVariables } from './getAuthVariables.ts'
import { ContentTypes } from '../detectContentType.ts'

export type Credentials = {
  signature: string
  value: string
}

type AuthResponse = {
  data: {
    videoPlaybackAccessToken: Credentials
    clip: {
      playbackAccessToken: Credentials
    }
    streamPlaybackAccessToken: Credentials
  }
}

export const getCredentials = async (
  contentType: ContentTypes,
  id: ContentId
): Promise<Credentials> => {
  const response = await fetch('https://gql.twitch.tv/gql', {
    method: 'POST',
    body: JSON.stringify(getAuthVariables(contentType, id)),
    headers: getAuthHeaders()
  })

  const responseData: AuthResponse = await response.json()

  return getAccessTokenFromResponse(contentType, responseData)
}

const getAccessTokenFromResponse = (
  contentType: ContentTypes,
  response: AuthResponse
): Credentials => {
  if (contentType === ContentTypes.VOD) {
    return response.data.videoPlaybackAccessToken
  } else if (contentType === ContentTypes.CLIP) {
    return response.data.clip.playbackAccessToken
  } else {
    return response.data.streamPlaybackAccessToken
  }
}
