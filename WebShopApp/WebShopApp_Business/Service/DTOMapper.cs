﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WebShopApp_Business.DTO;
using WebShopApp_Data.Models;

namespace WebShopApp_Business.Service
{
    public static class DTOMapper
    {
        public static ArticleDTO Article_To_ArticleDTO(Article article) 
        {
            return new ArticleDTO(
                article.Id, 
                article.SalesmanId, 
                article.Name, 
                article.Price,
                article.Quantity, 
                article.Description, 
                article.Image);
        }

        public static ArticleDTO ArticleForOrder_To_ArticleDTO(ArticleForOrder article)
        {
            return new ArticleDTO(
                article.OriginalArticleId,
                article.SalesmanId,
                article.Name,
                article.Price,
                article.Quantity,
                article.Description,
                article.Image);
        }
        public static ArticleForOrder ArticleDTO_to_ArticleForOrder(ArticleDTO articleDto)
        {
            return new ArticleForOrder(
                articleDto.SalesmanId,
                articleDto.Id,
                articleDto.Name,
                articleDto.Price,
                articleDto.Quantity,
                articleDto.Description,
                articleDto.Image
                );
        }

        public static Article ArticleDTO_to_Article(ArticleDTO articleDto)
        {
            return new Article(
                articleDto.SalesmanId,
                articleDto.Name,
                articleDto.Price,
                articleDto.Quantity,
                articleDto.Description,
                articleDto.Image
                );
        }

        public static User UserDTO_To_User(UserDTO userDto)
        {
            return new User(
                userDto.Username,
                userDto.Email,
                userDto.Password,
                userDto.Name,
                userDto.DateOfBirth,
                userDto.Address,
                userDto.Role,
                userDto.Image,
                userDto.Status
                );
        }
        public static UserDTO User_To_UserDTO(User user)
        {
            return new UserDTO(
                user.Id,
                user.Username,
                user.Email,
                user.Password,
                user.Name,
                user.DateOfBirth,
                user.Address,
                user.Role,
                user.Image,
                user.Status
                );
        }

        public static UserDTO User_To_UserDTO_Safe(User user)
        {
            return new UserDTO(
                user.Id,
                user.Username,
                user.Email,
                "", //no password
                user.Name,
                user.DateOfBirth,
                user.Address,
                user.Role,
                user.Image,
                user.Status
                );
        }

        public static Order OrderDTO_To_Order(OrderDTO orderDto)
        {
            return new Order(
                orderDto.CustomerId,
                List_ArticleDTO_to_ArticleForOrder(orderDto.Articles),
                DateTime.Now,
                DateTime.Now.AddHours(3), //TO DO: random amount of time > 1h
                orderDto.Comment,
                orderDto.Address,
                orderDto.Price,
                OrderStatus.Processing
                );
        }

        public static OrderResponseDTO Order_To_OrderResponseDTO(Order order)
        {
            return new OrderResponseDTO(
                order.Id,
                List_ArticleForOrder_to_ArticleDTO(order.Articles),
                order.StartTime.ToString("yyyy-MM-dd HH:mm:ss"),
                order.EndTime.ToString("yyyy-MM-dd HH:mm:ss"),
                order.Comment,
                order.Address,
                order.Price,
                order.Status
                );
        }

        public static List<ArticleForOrder> List_ArticleDTO_to_ArticleForOrder(List<ArticleDTO> articlesDto)
        {
            List<ArticleForOrder> articles = new List<ArticleForOrder>();
            foreach (ArticleDTO article in articlesDto)
            {
                articles.Add(ArticleDTO_to_ArticleForOrder(article));
            }
            return articles;
        }

        public static List<ArticleDTO> List_ArticleForOrder_to_ArticleDTO(List<ArticleForOrder> articles)
        {
            List<ArticleDTO> articlesDto = new List<ArticleDTO>();
            foreach (ArticleForOrder article in articles)
            {
                articlesDto.Add(ArticleForOrder_To_ArticleDTO(article));
            }
            return articlesDto;
        }

        public static List<ArticleDTO> List_Article_to_ArticleDTO(List<Article> articles)
        {
            List<ArticleDTO> articlesDto = new List<ArticleDTO>();
            foreach (Article article in articles)
            {
                articlesDto.Add(Article_To_ArticleDTO(article));
            }
            return articlesDto;
        }

        public static List<UserDTO> List_User_to_UserDTO(List<User> users)
        {
            List<UserDTO> usersDto = new List<UserDTO>();
            foreach (User user in users)
            {
                usersDto.Add(User_To_UserDTO_Safe(user));
            }
            return usersDto;
        }

        public static List<OrderResponseDTO> List_Order_to_OrderResponseDTO(List<Order> orders)
        {
            List<OrderResponseDTO> ordersDto = new List<OrderResponseDTO>();
            foreach (Order order in orders)
            {
                ordersDto.Add(Order_To_OrderResponseDTO(order));
            }
            return ordersDto;
        }
    }
}
