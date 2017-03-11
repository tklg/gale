import React from 'react';

export default class GalleryPanel extends React.Component {
	render() {
		return (
			<article className={"gallery-panel " + this.props.viewMode + " " + (this.props.isPlaceholder ? 'placeholder' : '')}>
				<img src={this.props.children} />
				<h1>{this.props.title}</h1>
				{!this.props.isPlaceholder && 
					<div className="tags">
						{
							this.props.tags.map((x, i) => {
								return <span key={i} className="tag" onClick={() => x.onClick(x.name)}>{x.name}</span>
							})
						}
					</div>
				}
			</article>
		);
	}
}
