/**
 * External dependencies
 */
import { PrivacySettingProp, RatingProp, VideoTracksResponseBodyProps } from '../../../types';
import { VideoGUID, VideoId } from '../../blocks/video/types';

export type UseVideoDataArgumentsProps = {
	id?: VideoId;
	guid?: VideoGUID;
	isPrivate?: boolean;
};

export type VideoDataProps = {
	allow_download?: boolean;
	description?: string;
	display_embed?: boolean;
	filename?: string;
	guid?: VideoGUID;
	is_private?: boolean;
	post_id?: number;
	privacy_setting?: PrivacySettingProp;
	rating?: RatingProp;
	title?: string;
	tracks?: VideoTracksResponseBodyProps;
};

export type UseVideoDataProps = {
	videoData: VideoDataProps;
	isRequestingVideoData: boolean;
};
