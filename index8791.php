<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE rdf:RDF[
	<!ENTITY rdf 'http://www.w3.org/1999/02/22-rdf-syntax-ns#'>
	<!ENTITY rdfs 'http://www.w3.org/2000/01/rdf-schema#'>
	<!ENTITY owl 'http://www.w3.org/2002/07/owl#'>
	<!ENTITY swivt 'http://semantic-mediawiki.org/swivt/1.0#'>
	<!ENTITY wiki 'http://ggform.netlify.app/Special:URIResolver/'>
	<!ENTITY category 'http://ggform.netlify.app/Special:URIResolver/Category-3A'>
	<!ENTITY property 'http://ggform.netlify.app/Special:URIResolver/Property-3A'>
	<!ENTITY wikiurl 'http://ggform.netlify.app'>
]>

<rdf:RDF
	xmlns:rdf="&rdf;"
	xmlns:rdfs="&rdfs;"
	xmlns:owl ="&owl;"
	xmlns:swivt="&swivt;"
	xmlns:wiki="&wiki;"
	xmlns:category="&category;"
	xmlns:property="&property;">

	<owl:Ontology rdf:about="http://ggform.netlify.app/Special:ExportRDF/ggform">
		<swivt:creationDate rdf:datatype="http://www.w3.org/2001/XMLSchema#dateTime">2024-09-08T12:22:38+00:00</swivt:creationDate>
		<owl:imports rdf:resource="http://semantic-mediawiki.org/swivt/1.0"/>
	</owl:Ontology>
	<swivt:Subject rdf:about="http://ggform.netlify.app/Special:URIResolver/ggform">
		<rdfs:label>Grand Guide - WikiForm</rdfs:label>
		<rdfs:isDefinedBy rdf:resource="http://ggform.netlify.app/Special:ExportRDF/ggform"/>
		<swivt:page rdf:resource="http://ggform.netlify.app/index"/>
		<swivt:wikiNamespace rdf:datatype="http://www.w3.org/2001/XMLSchema#integer">0</swivt:wikiNamespace>
		<swivt:wikiPageContentLanguage rdf:datatype="http://www.w3.org/2001/XMLSchema#string">en</swivt:wikiPageContentLanguage>
		<property:Has_query rdf:resource="&wiki;index-23_QUERYdb93aca0a47e7a5ccc3adc5c37c2d43f"/>
		<swivt:wikiPageModificationDate rdf:datatype="http://www.w3.org/2001/XMLSchema#dateTime">2024-05-29T02:51:04Z</swivt:wikiPageModificationDate>
		<property:Modification_date-23aux rdf:datatype="http://www.w3.org/2001/XMLSchema#double">2460459.6187963</property:Modification_date-23aux>
		<swivt:wikiPageSortKey rdf:datatype="http://www.w3.org/2001/XMLSchema#string">Grand Guide - WikiForm</swivt:wikiPageSortKey>
		<property:Page_Image rdf:resource="&wiki;File-3APlaceholderv2.png"/>
	</swivt:Subject>
	<swivt:Subject rdf:about="http://ggform.netlify.app/Special:URIResolver/index-23_QUERYdb93aca0a47e7a5ccc3adc5c37c2d43f">
		<swivt:masterPage rdf:resource="&wiki;gg_form"/>
		<swivt:wikiNamespace rdf:datatype="http://www.w3.org/2001/XMLSchema#integer">0</swivt:wikiNamespace>
		<property:Query_depth rdf:datatype="http://www.w3.org/2001/XMLSchema#double">0</property:Query_depth>
		<property:Query_format rdf:datatype="http://www.w3.org/2001/XMLSchema#string">plainlist</property:Query_format>
		<property:Query_size rdf:datatype="http://www.w3.org/2001/XMLSchema#double">1</property:Query_size>
		<property:Query_string rdf:datatype="http://www.w3.org/2001/XMLSchema#string">[[:Sabre Peregrine]]</property:Query_string>
		<swivt:wikiPageSortKey rdf:datatype="http://www.w3.org/2001/XMLSchema#string">Grand Guide - WikiForm# QUERYdb93aca0a47e7a5ccc3adc5c37c2d43f</swivt:wikiPageSortKey>
	</swivt:Subject>
	<swivt:Subject rdf:about="http://ggform.netlify.app/Special:URIResolver/index">
		<rdfs:label>Main Page</rdfs:label>
		<rdfs:isDefinedBy rdf:resource="http://ggform.netlify.app/Special:ExportRDF/index"/>
		<swivt:page rdf:resource="http://ggform.netlify.app/index"/>
		<swivt:wikiNamespace rdf:datatype="http://www.w3.org/2001/XMLSchema#integer">0</swivt:wikiNamespace>
		<swivt:wikiPageContentLanguage rdf:datatype="http://www.w3.org/2001/XMLSchema#string">en</swivt:wikiPageContentLanguage>
		<swivt:redirectsTo rdf:resource="&wiki;gg_form"/>
		<owl:sameAs rdf:resource="&wiki;gg_form/>
		<swivt:wikiPageSortKey rdf:datatype="http://www.w3.org/2001/XMLSchema#string">Main Page</swivt:wikiPageSortKey>
	</swivt:Subject>
	<owl:DatatypeProperty rdf:about="http://ggform.netlify.app/Special:URIResolver/Property-3A_REDI">
		<rdfs:label> REDI</rdfs:label>
		<rdfs:isDefinedBy rdf:resource="http://ggform.netlify.app/Special:ExportRDF/Property-3A_REDI"/>
		<swivt:page rdf:resource="http://ggform.netlify.app/Property-3A_REDI"/>
		<swivt:wikiNamespace rdf:datatype="http://www.w3.org/2001/XMLSchema#integer">102</swivt:wikiNamespace>
		<swivt:wikiPageContentLanguage rdf:datatype="http://www.w3.org/2001/XMLSchema#string">en</swivt:wikiPageContentLanguage>
		<swivt:wikiPageSortKey rdf:datatype="http://www.w3.org/2001/XMLSchema#string">REDI</swivt:wikiPageSortKey>
	</owl:DatatypeProperty>
	<owl:DatatypeProperty rdf:about="http://semantic-mediawiki.org/swivt/1.0#creationDate" />
	<owl:ObjectProperty rdf:about="http://semantic-mediawiki.org/swivt/1.0#page" />
	<owl:DatatypeProperty rdf:about="http://semantic-mediawiki.org/swivt/1.0#wikiNamespace" />
	<owl:DatatypeProperty rdf:about="http://semantic-mediawiki.org/swivt/1.0#wikiPageContentLanguage" />
	<owl:ObjectProperty rdf:about="http://ggform.netlify.app/Special:URIResolver/Property-3AHas_query" />
	<owl:DatatypeProperty rdf:about="http://semantic-mediawiki.org/swivt/1.0#wikiPageModificationDate" />
	<owl:DatatypeProperty rdf:about="http://ggform.netlify.app/Special:URIResolver/Property-3AModification_date-23aux" />
	<owl:DatatypeProperty rdf:about="http://semantic-mediawiki.org/swivt/1.0#wikiPageSortKey" />
	<owl:ObjectProperty rdf:about="http://ggform.netlify.app/Special:URIResolver/Property-3APage_Image" />
	<owl:ObjectProperty rdf:about="http://semantic-mediawiki.org/swivt/1.0#masterPage" />
	<owl:DatatypeProperty rdf:about="http://ggform.netlify.app/Special:URIResolver/Property-3AQuery_depth" />
	<owl:DatatypeProperty rdf:about="http://ggform.netlify.app/Special:URIResolver/Property-3AQuery_format" />
	<owl:DatatypeProperty rdf:about="http://ggform.netlify.app/Special:URIResolver/Property-3AQuery_size" />
	<owl:DatatypeProperty rdf:about="http://ggform.netlify.app/Special:URIResolver/Property-3AQuery_string" />
	<owl:ObjectProperty rdf:about="http://semantic-mediawiki.org/swivt/1.0#redirectsTo" />
	<!-- Created by Semantic MediaWiki, https://www.semantic-mediawiki.org/ -->
</rdf:RDF>