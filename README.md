# safemeds
[![Build Status](https://magnum.travis-ci.com/pivotal-cf/safemeds.svg?token=Kj9ccJkpSr1yUTEgp9qK)](https://magnum.travis-ci.com/pivotal-cf/safemeds)

See it here [safemeds.cfapps.io](http://safemeds.cfapps.io)

**Our Approach**



Pivotal Labs is the Agile Development services arm of Pivotal, the software company at the intersection of Big Data, PaaS and Agile. Pivotal Labs is an Agile Extreme Programming consultancy that helps clients build great software through short feedback loops, transparency, client collaboration, and enablement.  



This project was different in that we received broad guidance and exposure to selected data sets. Typically, a client "product owner" collaborates closely with our project team; the lack of such client contact represents the primary departure from the norm. In most other ways, the description of our process (below) is typical and predictable. The timelines in <DOC> show our history of rapid learning, development, and iteration over a 7-day development exercise that began Monday, June 22 and concluded Tuesday, June 30. 



**Getting Started**



Upon receiving the assignment at 8:30 Monday morning, we convened an interdisciplinary software team. Our first tasks were to (1) evaluate the data we would be working with, (2) establish a product hypothesis that could be validated through user research, and (3) set up a development environment. By the end of Day 1, we had working software. 



Through generative interviews, the team rapidly identified that people who are successfully managing chronic conditions become worried when adding a new medication or over-the-counter treatment. This became the core value proposition of our application: "For people stabilized on a cocktail of medications, SafeMeds helps you know which prescription and over-the-counter medications will potentially disrupt your regimen."  



We focused the application by understanding the needs of end-users and relentlessly prioritizing only those increments of work that deliver the highest customer value. 



**How We Worked**



Rob Mee, Labs’ founder and current Senior Vice President of Pivotal, was among the originators of the Agile Software Development Methodology, and has kept Labs at the forefront of the discipline for the last 20 years. This project (like all projects at Pivotal Labs) faithfully applied an Extreme Programming approach, which means that our developers worked in pairs, developing code from a single backlog of stories. Each story represented the smallest increment of user value, and the backlog is ordered according to the priority sequence in which the developers ought to work. We practiced Test-Driven Development, Continuous Deployment and Integration, and Balanced Team. This approach embodies the values of simplicity, small batch size, rapid feedback, and continuous improvement.



Every aspect of our working process is present to maximize efficiency and quality. Three examples from this project that supported our Lean and Agile process are: 



1. Co-location of the team reduced communication overhead: Immediately upon receiving the assignment, the designer, product manager, and software developers moved workstations to sit together throughout the duration of the project. This significantly reduced communication overhead and eliminated feedback delays. 



2. Patterned meetings reduced stress and increased focus: A pattern of predictable meetings (standup, retro, inception, and so on) with consistent agenda ensured that everyone knew when and how key issues would be voiced and resolved. This eliminated operational stressors, so that the team moved smoothly with a tight focus on the design and development. 



3.  Focusing our development efforts on the needs and goals of real users simplified decision-making: With a validated persona and problem statement, it was simple to prioritize stories in the backlog, ideate on features, and make judgement calls about where and when to increase or decrease scope. 



**Final Delivery** 



In this way, we were able to deliver a product by the original Challenge deadline. Likewise, when the deadline was extended, we were able to quickly convene and adjust scope given the new constraints of time and capacity. Our work patterns are optimized for continuous feedback and integrated teams, thus we were quickly able to determine how to use the extra time afforded by the extension. 



In the time allotted, we built a product that solves a real problem for real people. We mitigated the risk of project failure by having tight communication through an integrated product team, nearly 100% test coverage, and a fast and reliable PaaS for deployment. Our architecture for this product is easily adaptable to changing requirements. We accomplished all of this in 451 hours, demonstrating a remarkably efficient use of time and energy.



Labs's history of deep design, development and open-source expertise, and proven technology approach, has delivered high-quality working software in a consistently rapid, cost effective, and iterative manner to hundreds of clients. 


## Usage

```sh
npm install
gulp s
```

The server will be listening on `localhost:3000`  
