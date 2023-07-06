import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { AiOutlinePlus } from "react-icons/ai";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { FaTrashAlt } from "react-icons/fa";
import { GrClose } from "react-icons/gr";
import axios from "axios";
import cookies from "next-cookies";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: "15px",
};
const HomePage = ({ user, fetchedSections }) => {
  const [open, setOpen] = useState(false);
  const [cardOpen, setCardOpen] = useState(false);
  const [sectionDeleteOpen, setSectionDeleteOpen] = useState(false);

  const [newCardTitle, setNewCardTitle] = useState("");
  const [newCardDescription, setNewCardDescription] = useState("");
  const [timeToSpend, setTimeToSpend] = useState("");
  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [sections, setSections] = useState([]);
  useEffect(() => {
    setSections(fetchedSections.props.fetchedSections);
  }, []);
  console.log("Sections: ", sections);

  const [sectionId, setSectionId] = useState("");
  const [cardId, setCardId] = useState("");

  const handleDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const updatedSections = [...sections];
    const sourceSectionIndex = sections.findIndex(
      (section) => section.id === source.droppableId
    );
    const destinationSectionIndex = sections.findIndex(
      (section) => section.id === destination.droppableId
    );
    const card = updatedSections[sourceSectionIndex].cards.splice(
      source.index,
      1
    )[0];
    updatedSections[destinationSectionIndex].cards.splice(
      destination.index,
      0,
      card
    );

    setSections(updatedSections);
    axios
      .post(
        `http://localhost:8080/api/section/update/${sections[sourceSectionIndex].id}`,
        sections[sourceSectionIndex]
      )
      .then((res) => {})
      .catch((err) => {
        console.log("There is an error: ", err);
      });
    axios
      .post(
        `http://localhost:8080/api/section/update/${sections[destinationSectionIndex].id}`,
        sections[destinationSectionIndex]
      )
      .then((res) => {})
      .catch((err) => {
        console.log("There is an error: ", err);
      });
  };

  const handleAddCard = async (cardTitle, cardDescription, timeToSpend) => {
    if (!cardTitle) {
      return;
    }

    if (!cardDescription) {
      return;
    }

    const updatedSections = [...sections];
    const sectionIndex = updatedSections.findIndex(
      (section) => section.id === sectionId
    );
    updatedSections[sectionIndex].cards.push({
      id: `card-${Date.now()}`,
      title: cardTitle,
      description: cardDescription,
      createdTime: Date.now(),
      timeToSpend: timeToSpend,
    });
    setCardOpen(false);
    setNewCardDescription("");
    setNewCardTitle("");
    setTimeToSpend("");
    setSections(updatedSections);
    return true;
  };

  const handleAddSection = (title) => {
    if (!title) {
      return;
    }
    const newSection = {
      id: `section-${Date.now()}`,
      title: title,
      cards: [],
    };
    axios
      .post("http://localhost:8080/api/section/create", {
        section: newSection,
        user_id: user,
      })
      .then((res) => {})
      .catch((err) => {
        console.log("Something went wrong : ", err);
      });
    const updatedSections = [...sections, newSection];

    setSections(updatedSections);
    setOpen(false);
    setNewSectionTitle("");
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <div
      style={{
        background:
          "linear-gradient(rgba(0,0,0,0.3),rgba(0,0,0,0.3)) ,  url('/bg.jpeg')",
        backgroundSize: "cover",
      }}
      className="min-h-screen   p-6">
      <h1 className="text-4xl font-bold mb-4 text-center text-white">
        Task Stream
      </h1>
      <div className="bg-white rounded shadow-md p-4 mb-8 text-center flex items-center justify-center relative">
        Sections
        <AiOutlinePlus
          className="absolute  right-8 text-2xl cursor-pointer"
          onClick={handleOpen}
        />
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description">
          <Box sx={style} className="relative">
            <GrClose
              className="absolute right-4 top-4 text-lg cursor-pointer"
              onClick={() => {
                setOpen(false);
              }}
            />
            <input
              type="text"
              value={newSectionTitle}
              className="text-3xl text-center font-semibold outline-none bg-transparent border-b border-gray-300"
              onChange={(e) => setNewSectionTitle(e.target.value)}
              placeholder="Section Title"
            />
            <div className="my-4 w-full flex items-center justify-center">
              <button
                onClick={() => handleAddSection(newSectionTitle)}
                className="mt-4 px-4 py-2 text-sm font-semibold text-white
              bg-gradient-to-r from-blue-700 to-indigo-500 rounded-lg
              hover:bg-gradient-to-r hover:from-blue-600 hover:to-indigo-400
              focus:outline-none focus:bg-gradient-to-r focus:from-blue-600
              focus:to-indigo-400">
                Add Section
              </button>
            </div>
          </Box>
        </Modal>
      </div>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className=" flex jusitfy-evenly items-start">
          {sections.map((section, index) => (
            <div
              key={section.id}
              className="flex-1 bg-white bg-opacity-30 mx-8  rounded relative shadow-md p-4">
              <div className="flex   justify-between items-center mb-4">
                <p className="text-lg w-1/2 text-white font-semibold outline-none bg-transparent border-b-4 border-gray-300">
                  {section.title}
                </p>
                <Modal
                  open={cardOpen}
                  onClose={() => {
                    setNewCardTitle("");
                    setNewCardDescription("");
                    setTimeToSpend("");
                    setCardOpen(false);
                  }}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description">
                  <Box sx={style} className="relative">
                    <GrClose
                      className="absolute right-4 top-4 text-lg cursor-pointer"
                      onClick={() => {
                        setNewCardTitle("");
                        setNewCardDescription("");
                        setTimeToSpend("");
                        setCardOpen(false);
                      }}
                    />
                    <div className="flex flex-col justify-center items-center">
                      <input
                        type="text"
                        value={newCardTitle}
                        className="text-3xl text-center font-semibold outline-none bg-transparent border-b border-gray-300"
                        onChange={(e) => setNewCardTitle(e.target.value)}
                        placeholder="Task Title"
                      />
                      <textarea
                        type="text"
                        rows={5}
                        value={newCardDescription}
                        className="text-lg  resize-none my-4 font-semibold outline-none bg-transparent border rounded-lg px-4 border-gray-300"
                        onChange={(e) => setNewCardDescription(e.target.value)}
                        placeholder="Task Description"
                      />
                      <input
                        type="text"
                        value={timeToSpend}
                        className="text-lg  font-semibold outline-none bg-transparent border rounded-lg px-4 border-gray-300"
                        onChange={(e) => setTimeToSpend(e.target.value)}
                        placeholder="Time should be spent for the task (days)"
                      />
                    </div>
                    <div className="my-4 w-full flex items-center justify-center">
                      <button
                        onClick={async () => {
                          const returnValue = await handleAddCard(
                            newCardTitle,
                            newCardDescription,
                            timeToSpend
                          );
                          if (returnValue) {
                            const sectionIndex = sections.findIndex(
                              (section) => section.id === sectionId
                            );
                            axios
                              .post(
                                `http://localhost:8080/api/section/update/${sectionId}`,
                                sections[sectionIndex]
                              )
                              .then((res) => {})
                              .catch((err) => {
                                console.log(err);
                              });
                          }
                        }}
                        className="mt-4 px-4 py-2 text-sm font-semibold text-white
              bg-gradient-to-r from-blue-700 to-indigo-500 rounded-lg
              hover:bg-gradient-to-r hover:from-blue-600 hover:to-indigo-400
              focus:outline-none focus:bg-gradient-to-r focus:from-blue-600
              focus:to-indigo-400">
                        Add Card
                      </button>
                    </div>
                  </Box>
                </Modal>
                <button
                  className="text-white hover:text-red-500"
                  onClick={() => {
                    setSectionDeleteOpen(true);
                    setSectionId(section.id);
                  }}>
                  Delete
                </button>
                <Modal
                  open={sectionDeleteOpen}
                  onClose={() => setSectionDeleteOpen(false)}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description">
                  <Box sx={style} className="relative">
                    <GrClose
                      className="absolute right-4 top-4 text-lg cursor-pointer"
                      onClick={() => {
                        setSectionDeleteOpen(false);
                      }}
                    />
                    <p className="text-center text-3xl">Delete the Section ?</p>
                    <div className="my-4 w-full flex items-center justify-center">
                      <FaTrashAlt className="text-6xl text-red-600" />
                    </div>
                    <p className="text-center text-lg font-light">
                      If you delete the section. All the tasks contained by the
                      section will be removed as well are you sure to delete
                      anyway?
                    </p>
                    <div className="flex justify-between">
                      <button
                        className="mt-4 px-4 py-2 text-sm font-semibold text-white 0 bg-gray-400 rounded-lg hover:bg-gradient-to-r hover:from-blue-800 hover:to-indigo-500 focus:outline-none focus:bg-gradient-to-r focus:from-blue-600 focus:to-indigo-400"
                        onClick={() => {
                          setSectionDeleteOpen(false);
                        }}>
                        No
                      </button>
                      <button
                        className="mt-4 px-4 py-2 text-sm font-semibold text-white bg-red-700 rounded-lg hover:bg-gradient-to-r hover:from-blue-800 hover:to-indigo-500 focus:outline-none focus:bg-gradient-to-r focus:from-blue-600 focus:to-indigo-400"
                        onClick={() => {
                          const updatedSections = sections.filter(
                            (s) => s.id !== sectionId
                          );
                          setSections(updatedSections);
                          setSectionDeleteOpen(false);
                          axios
                            .post(
                              `http://localhost:8080/api/section/delete/${sectionId}`
                            )
                            .then((res) => {})
                            .catch((err) => {
                              console.log("err: ", err);
                            });
                        }}>
                        Yes
                      </button>
                    </div>
                  </Box>
                </Modal>
              </div>
              <Droppable droppableId={section.id}>
                {(provided) => (
                  <div
                    className="space-y-4"
                    ref={provided.innerRef}
                    {...provided.droppableProps}>
                    {section.cards.map((card, index) => (
                      <Draggable
                        key={card.id}
                        draggableId={card.id}
                        index={index}>
                        {(provided) => (
                          <div
                            className="bg-white bg-opacity-30  rounded relative shadow-lg p-4 rounded p-2 flex flex-col"
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}>
                            <FaTrashAlt
                              className="absolute top-5 right-5 cursor-pointer"
                              onClick={() => {
                                const sectionIndex = sections.findIndex(
                                  (s) => s.id === section.id
                                );

                                sections[sectionIndex].cards.map((c, index) => {
                                  if (c.id === card.id) {
                                    section.cards.splice(index, 1);
                                  }
                                });
                                setSections([...sections]);

                                axios
                                  .post(
                                    `http://localhost:8080/api/section/update/${section.id}`,
                                    sections[sectionIndex]
                                  )
                                  .then((res) => {})
                                  .catch((err) => {
                                    console.log(err);
                                  });
                              }}
                            />
                            <p className="text-lg font-bold outline-none bg-transparent mb-2">
                              {card.title}
                            </p>
                            <p className="text-sm bg-transparent outline-none resize-none">
                              {card.description}
                            </p>
                            <div className="flex justify-between">
                              <p className="text-sm">Created at:</p>
                              <p className="text-sm bg-transparent outline-none resize-none">
                                {Date(card.createdTime).split("G")[0]}
                              </p>
                            </div>
                            <div className="flex justify-between">
                              <p className="text-sm">
                                Time to spend for the task:
                              </p>
                              <p className="text-sm bg-transparent outline-none resize-none">
                                {card.timeToSpend}
                              </p>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
              <div className="flex justify-end">
                <button
                  className="mt-4 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-900 to-indigo-700 rounded-lg hover:bg-gradient-to-r hover:from-blue-800 hover:to-indigo-500 focus:outline-none focus:bg-gradient-to-r focus:from-blue-600 focus:to-indigo-400"
                  onClick={() => {
                    setSectionId(section.id);
                    setCardOpen(true);
                  }}>
                  Add Card
                </button>
              </div>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};
export const getServerSideProps = async (context) => {
  const c = cookies(context);

  if (!c.user_id) {
    const { res } = context;
    res.setHeader("location", "/login");
    res.statusCode = 302;
    res.end();
    return;
  }
  const response = await axios
    .get(`http://localhost:8080/api/section/get/${c.user_id}`)
    .then((res) => {
      return {
        props: {
          user: c.user_id,
          fetchedSections: res.data,
        },
      };
    });
  return {
    props: {
      user: c.user_id,
      fetchedSections: response,
    },
  };
};

export default HomePage;
