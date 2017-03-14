import React from 'react';

export default class Modal extends React.Component {
	render() {
		return (
		<section className="modal" data-active={!!this.props.content || null} onClick={this.props.close} >
			{!!this.props.content && <article onClick={e => e.stopPropagation()} >
				{this.props.content.header && <header><h1>{this.props.content.header}</h1></header>}
				{this.props.content.content && <main>
					{this.props.content.content}
				</main>}
				{this.props.content.footer}
			</article>}
		</section>);
	}
}
