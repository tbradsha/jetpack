/**
 * External dependencies
 */
import { Spinner } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { Icon, chevronLeft, chevronRight } from '@wordpress/icons';
import clsx from 'clsx';
/**
 * Internal dependencies
 */
import AiFeedbackThumbs from '../../ai-feedback';
import AiIcon from '../../ai-icon';
import './carrousel.scss';

export type CarrouselImageData = {
	image?: string;
	libraryId?: number | string;
	libraryUrl?: string;
	generating?: boolean;
	error?: {
		message: string;
	};
};

export type CarrouselImages = CarrouselImageData[];

function BlankImage( { children, isDotted = false, contentClassName = '' } ) {
	const blankImage = (
		<img
			className="ai-assistant-image__carrousel-image"
			src="data:image/svg+xml;utf8,<svg viewBox='0 0 1 1' width='1024' height='768' xmlns='http://www.w3.org/2000/svg'><path d='M0 0 L1 0 L1 1 L0 1 L0 0 Z' fill='none' /></svg>"
			alt=""
		/>
	);

	return (
		<div className="ai-assistant-image__blank">
			{ blankImage }
			<div
				className={ clsx( 'ai-assistant-image__blank-content', contentClassName, {
					'is-dotted': isDotted,
				} ) }
			>
				{ children }
			</div>
		</div>
	);
}

export default function Carrousel( {
	images,
	current,
	handlePreviousImage,
	handleNextImage,
	actions = null,
}: {
	images: CarrouselImages;
	current: number;
	handlePreviousImage: () => void;
	handleNextImage: () => void;
	actions?: React.JSX.Element;
} ) {
	const prevButton = (
		<button className="ai-carrousel__prev" onClick={ handlePreviousImage }>
			<Icon
				icon={ chevronLeft }
				className={ clsx( 'ai-carrousel__prev-icon', {
					'is-disabled': current === 0,
				} ) }
			/>
		</button>
	);

	const nextButton = (
		<button className="ai-carrousel__next" onClick={ handleNextImage }>
			<Icon
				icon={ chevronRight }
				className={ clsx( 'ai-carrousel__next-icon', {
					'is-disabled': current + 1 === images.length,
				} ) }
			/>
		</button>
	);

	const total = images?.filter?.( item => item?.generating || Object.hasOwn( item, 'image' ) )
		?.length;

	const actual = current === 0 && total === 0 ? 0 : current + 1;

	const aiFeedbackDisabled = imageData => {
		const { image, generating, error } = imageData;

		// disable if there's an empty modal
		if ( ! image && ! generating && ! error ) {
			return true;
		}

		// also disable if we're generating or have an error
		if ( generating || error ) {
			return true;
		}

		// otherwise we're fine
		return false;
	};

	return (
		<div className="ai-assistant-image__carrousel">
			<div className="ai-assistant-image__carrousel-images">
				{ images.length > 1 && prevButton }
				{ images.map( ( { image, generating, error }, index ) => (
					<div
						key={ `image:` + index }
						className={ clsx( 'ai-assistant-image__carrousel-image-container', {
							'is-current': current === index,
							'is-prev': current > index,
						} ) }
					>
						{ generating ? (
							<BlankImage contentClassName="ai-assistant-image__loading">
								{ __( 'Creating image…', 'jetpack' ) }
								<Spinner
									style={ {
										width: '50px',
										height: '50px',
									} }
								/>
							</BlankImage>
						) : (
							<>
								{ error ? (
									<BlankImage isDotted>
										<div className="ai-assistant-image__error">
											{ __(
												'An error occurred while generating the image. Please, try again!',
												'jetpack'
											) }
											{ error?.message && (
												<span className="ai-assistant-image__error-message">
													{ error?.message }
												</span>
											) }
										</div>
									</BlankImage>
								) : (
									<>
										{ ! generating && ! image ? (
											<BlankImage>
												<AiIcon />
											</BlankImage>
										) : (
											<img className="ai-assistant-image__carrousel-image" src={ image } alt="" />
										) }
									</>
								) }
							</>
						) }
					</div>
				) ) }
				{ images.length > 1 && nextButton }
			</div>
			<div className="ai-assistant-image__carrousel-footer">
				<div className="ai-assistant-image__carrousel-footer-left">
					<div className="ai-assistant-image__carrousel-counter">
						{ prevButton }
						{ actual } / { total }
						{ nextButton }
					</div>

					<AiFeedbackThumbs
						disabled={ aiFeedbackDisabled( images[ current ] ) }
						ratedItem={ images[ current ].libraryUrl || '' }
						iconSize={ 20 }
					/>
				</div>

				<div className="ai-assistant-image__carrousel-actions">{ actions }</div>
			</div>
		</div>
	);
}
